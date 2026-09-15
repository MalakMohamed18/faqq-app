"""Egyptian (Cairene) Arabic grapheme-to-phoneme front-end.

Turns diacritized Egyptian text into the IPA symbol set the model was trained
on. Modern Standard Arabic phonemisation will not do: five consonants are
realised differently in Cairene, and a model fed MSA phonemes produces MSA
pronunciation regardless of how the text was written.

    ج  ->  /ɡ/     unconditional
    ق  ->  /ʔ/     except in Qur'anic and learned vocabulary, which keeps /q/
    ث  ->  /t/     except in learned vocabulary, which takes /s/
    ذ  ->  /z/     except in a small inherited set, which takes /d/
    ظ  ->  /zˤ/    except in a small inherited set, which takes /dˤ/

The exceptions are lexical, not rule-governed, so each lives in a word list
under `lexicons/`. Lookup strips fused proclitics (و ف ب ك ل ال …) because a
proclitic never changes how the stem's consonants are realised.

Two implementation notes that the code depends on:

* espeak-ng emits **ð for both ذ and ظ** — it produces no ðˤ — so those two
  rules cannot be told apart on the phoneme string and are decided from the
  word's letters instead. A word carrying both letters is left alone.
* Rewrites run **before** the phoneme fixups, which strip the pharyngealisation
  marker and the dental bridge. Running them after would collapse distinctions
  the rules still need.

Usage:
    from kemetone import EgyptianG2P
    g2p = EgyptianG2P()
    g2p("قَالَ لِي جَمِيل")        # -> 'ʔˈaːla liː ɡˈamiːl'
"""
from __future__ import annotations

import re
from collections import Counter
from pathlib import Path

from .arabic import skeleton, strip_irab
from .normalize_tashkeel import normalize as normalize_marks

LEXDIR = Path(__file__).resolve().parent / "lexicons"

# Symbols outside the model's inventory, mapped or dropped.
PHONEME_FIXUPS = {
    "̪": "",   # combining bridge below (dental)
    "ˤ": "",   # pharyngealisation marker
    "[": "", "]": "", "{": "", "}": "",
}

_SYLLABLE_DOT = re.compile(r"(?<=\S)\.(?=\S)")
_LATIN_RUN = re.compile(r"[A-Za-z]+")
_CITATION = re.compile(r"\[[^\]]*\]")
_WS = re.compile(r"\s+")

# What espeak-ng's Arabic voice emits for each letter we rewrite. ج is a single
# codepoint (U+02A4), not a d+ʒ tie bar, so a plain replace is safe.
PH_JEEM, PH_QAF, PH_THEH, PH_DHAL = "ʤ", "q", "θ", "ð"

# A word that makes the NEXT word a Qur'anic proper noun, which keeps /q/.
# Sura names cannot go in the flat lexicon: most double as ordinary words said
# with /ʔ/ — البقرة is "the cow", القصص is "stories".
Q_NEXT_TRIGGERS = {"سوره", "سور"}

_PROCLITICS = ("وال", "فال", "بال", "كال", "لل", "ال", "و", "ف", "ب", "ك", "ل")


def load_lexicon(letter: str, path: str | Path | None = None) -> set[str]:
    p = Path(path) if path else LEXDIR / f"{letter}.tsv"
    if not p.exists():
        return set()
    out = set()
    for line in p.read_text(encoding="utf-8").splitlines():
        line = line.split("#", 1)[0].strip()
        if line:
            out.add(line.split("\t", 1)[0])
    return out


def lexicon_lookup(skel: str, lex: set[str]) -> bool:
    """Membership test that tolerates fused proclitics."""
    if skel in lex:
        return True
    seen, frontier = {skel}, [skel]
    for _ in range(2):
        nxt = []
        for w in frontier:
            for p in _PROCLITICS:
                if w.startswith(p) and len(w) - len(p) >= 3:
                    s = w[len(p):]
                    if s in lex:
                        return True
                    if s not in seen:
                        seen.add(s)
                        nxt.append(s)
        frontier = nxt
    return False


def normalize_text(text: str) -> tuple[str, int]:
    text = _CITATION.sub(" ", text)
    # Tatweel has no phonetic value, but espeak reads it BY NAME when bare —
    # "الـ" comes out as the spoken word تطويل.
    text = text.replace("ـ", "")
    latin = _LATIN_RUN.findall(text)
    if latin:
        text = _LATIN_RUN.sub(" ", text)
    return _WS.sub(" ", text).strip(), len(latin)


def clean_phonemes(ph: str) -> str:
    ph = _SYLLABLE_DOT.sub("", ph)
    for old, new in PHONEME_FIXUPS.items():
        ph = ph.replace(old, new)
    return ph


class EgyptianG2P:
    """Diacritized Egyptian text -> IPA.

    Args:
        dialect: apply the Egyptian rewrites. False gives plain MSA output.
        pausal:  drop word-final case endings before phonemising. On by default,
                 and applied here so that every input is treated identically.
    """

    def __init__(self, dialect: bool = True, lexicon_dir: str | Path | None = None,
                 pausal: bool = True):
        from misaki import espeak

        from .runtime import init_espeak
        init_espeak()

        self._g2p = espeak.EspeakG2P(language="ar")
        self.dialect = dialect
        self.pausal = pausal
        d = Path(lexicon_dir) if lexicon_dir else LEXDIR
        self.lex = {ch: load_lexicon(ch, d / f"{ch}.tsv") for ch in ("ق", "ث", "ذ", "ظ")}

        self.n_words = 0
        self.n_rule = Counter()
        self.n_exception = Counter()
        self.n_ambiguous = 0
        self.oov = Counter()

    def _rewrite_word(self, ph: str, word: str, prev: str | None = None) -> str:
        skel = skeleton(word)

        if PH_JEEM in ph:
            self.n_rule["ج>ɡ"] += 1
            ph = ph.replace(PH_JEEM, "ɡ")

        if PH_QAF in ph:
            keep_q = lexicon_lookup(skel, self.lex["ق"]) or (
                prev is not None and skeleton(prev) in Q_NEXT_TRIGGERS
            )
            if keep_q:
                self.n_exception["ق>q"] += 1
            else:
                self.n_rule["ق>ʔ"] += 1
                ph = ph.replace(PH_QAF, "ʔ")

        if PH_THEH in ph:
            if lexicon_lookup(skel, self.lex["ث"]):
                self.n_exception["ث>s"] += 1
                ph = ph.replace(PH_THEH, "s")
            else:
                self.n_rule["ث>t"] += 1
                ph = ph.replace(PH_THEH, "t")

        # ð is both ذ and ظ — decide from the spelling.
        if PH_DHAL in ph:
            has_dhal, has_zah = "ذ" in skel, "ظ" in skel
            if has_dhal and has_zah:
                self.n_ambiguous += 1
            elif has_zah:
                if lexicon_lookup(skel, self.lex["ظ"]):
                    self.n_exception["ظ>d"] += 1
                    ph = ph.replace(PH_DHAL, "dˤ")
                else:
                    self.n_rule["ظ>z"] += 1
                    ph = ph.replace(PH_DHAL, "zˤ")
            elif has_dhal:
                if lexicon_lookup(skel, self.lex["ذ"]):
                    self.n_exception["ذ>d"] += 1
                    ph = ph.replace(PH_DHAL, "d")
                else:
                    self.n_rule["ذ>z"] += 1
                    ph = ph.replace(PH_DHAL, "z")
        return ph

    def phonemize(self, text: str) -> str:
        text, _ = normalize_text(text)
        if not text:
            return ""
        # A vowel written before a shadda makes espeak drop it silently, and
        # both orders occur in real text — canonicalise on the way in.
        text = normalize_marks(text)
        if self.pausal:
            text = strip_irab(text)

        raw, _ = self._g2p(text)
        if not self.dialect:
            return clean_phonemes(raw)

        words, parts = text.split(" "), raw.split(" ")
        self.n_words += len(words)
        if len(parts) == len(words):
            out = " ".join(
                self._rewrite_word(p, w, words[i - 1] if i else None)
                for i, (p, w) in enumerate(zip(parts, words))
            )
        else:
            # espeak merged or split something; phonemise word by word so the
            # rules stay word-scoped.
            out = " ".join(
                self._rewrite_word(self._g2p(w)[0], w, words[i - 1] if i else None)
                for i, w in enumerate(words)
            )
        return clean_phonemes(out)

    __call__ = phonemize

    def stats(self) -> dict:
        return {
            "words": self.n_words,
            "rules_fired": dict(self.n_rule),
            "lexicon_exceptions": dict(self.n_exception),
            "ambiguous_words": self.n_ambiguous,
        }
