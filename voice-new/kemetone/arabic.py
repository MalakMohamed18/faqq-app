"""Arabic orthography helpers used by the front-end."""
from __future__ import annotations
import unicodedata

SHADDA = "ّ"
FINAL_MARKS = frozenset(["ً", "ٌ", "ٍ", "َ", "ُ", "ِ", "ْ", "ٰ"])
ALL_HARAKAT = FINAL_MARKS | {SHADDA}
KEPT_FINAL = frozenset([SHADDA, "ْ"])
ALEF_VARIANTS = str.maketrans({"أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا", "ة": "ه", "ى": "ي"})
ARABIC_LETTERS = frozenset("ابتثجحخدذرزسشصضطظعغفقكلمنهويءأإآئؤةى")


def is_mark(ch: str) -> bool:
    return unicodedata.category(ch) == "Mn"


def letters(word: str) -> str:
    return "".join(c for c in word if not is_mark(c))


def skeleton(word: str) -> str:
    """Lookup key: Arabic letters only, orthography normalised."""
    return "".join(
        c for c in letters(word).translate(ALEF_VARIANTS) if c in ARABIC_LETTERS
    )


def strip_irab(text: str) -> str:
    """Drop word-final case endings, keeping final sukun and shadda.

    Egyptian does not pronounce i'rab, and leaving it in leads the phonemiser to
    voice a final vowel that is not there. Applied to every input.

        رَجُلٌ -> رَجُل      حَقٌّ -> حَقّ      مِنْ -> مِنْ
    """
    out = []
    for word in text.split(" "):
        i = len(word)
        while i > 0 and word[i - 1] in ALL_HARAKAT:
            i -= 1
        out.append(word[:i] + "".join(c for c in word[i:] if c in KEPT_FINAL))
    return " ".join(out)
