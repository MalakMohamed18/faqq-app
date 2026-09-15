import sys
import torch
import soundfile as sf

from kokoro import KModel
from kemetone import EgyptianG2P

SR = 24000
REPO = "Rabe3/kemetone"


def main():
    text = sys.argv[1] if len(sys.argv) > 1 else "النَّهَارْدَه الْجَوّ حِلْو أَوِي"
    out = sys.argv[2] if len(sys.argv) > 2 else "out.wav"

    device = "cuda" if torch.cuda.is_available() else "cpu"

    print("Loading KemeTone...")

    model = KModel(
        repo_id=REPO,
        config="config.json",
        model="kemetone.pth"
    ).to(device).eval()

    voice = torch.load(
        "voices/kemetone.pt",
        map_location=device
    )

    ipa = EgyptianG2P()(text)

    print("phonemes:", ipa)

    with torch.no_grad():
        audio = model(
            ipa,
            voice[len(ipa) - 1]
        )

    sf.write(
        out,
        audio.cpu().numpy(),
        SR
    )

    print(f" wrote {out}")
    print(f" duration: {len(audio) / SR:.1f}s")


if __name__ == "__main__":
    main()