"""espeak-ng wiring.

The front-end phonemises through espeak-ng's Arabic voice. Some environments
ship a `libespeak-ng.so` that will not load (an older glibc than the wheel was
built against is the usual cause). Point `KEMETONE_ESPEAK_LIB` at a working
build to override:

    export KEMETONE_ESPEAK_LIB=/path/to/libespeak-ng.so

The override must be applied AFTER `misaki.espeak` is imported, because that
module sets the library path at import time and phonemizer reads its value
before consulting the environment. `init_espeak()` handles the ordering.
"""
from __future__ import annotations
import os

_done = False


def init_espeak(library: str | None = None) -> str | None:
    """Prepare espeak-ng. Safe to call repeatedly."""
    global _done
    if _done:
        return os.environ.get("PHONEMIZER_ESPEAK_LIBRARY")

    import misaki.espeak  # noqa: F401  — sets its own path at import time

    lib = library or os.environ.get("KEMETONE_ESPEAK_LIB")
    if lib:
        from phonemizer.backend.espeak.wrapper import EspeakWrapper

        EspeakWrapper.set_library(lib)          # after misaki, so ours wins
        os.environ["PHONEMIZER_ESPEAK_LIBRARY"] = lib
        data = os.environ.get("KEMETONE_ESPEAK_DATA")
        if data:
            EspeakWrapper.set_data_path(data)
    _done = True
    return os.environ.get("PHONEMIZER_ESPEAK_LIBRARY")


def espeak_version() -> tuple:
    init_espeak()
    from phonemizer.backend import EspeakBackend

    return EspeakBackend.version()
