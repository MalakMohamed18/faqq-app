import torch
import soundfile as sf
from kokoro import KModel
from kemetone.g2p import EgyptianG2P

MODEL_PATH = "kemetone.pth"
CONFIG_PATH = "config.json"
VOICE_PATH = "voices/kemetone.pt"


print("🇪🇬 FEQQA — EGYPTIAN TTS")


print("Loading KemeTone...")

model = KModel(
    repo_id="Rabe3/kemetone",
    config=CONFIG_PATH,
    model=MODEL_PATH,
).eval()

checkpoint = torch.load(
    MODEL_PATH,
    map_location="cpu",
    weights_only=True
)


def convert_checkpoint_keys(state_dict):
    converted = {}

    for key, value in state_dict.items():
        key = key.replace(
            ".parametrizations.weight.original0",
            ".weight_g"
        )

        key = key.replace(
            ".parametrizations.weight.original1",
            ".weight_v"
        )

        converted[key] = value

    return converted


print(" Fixing checkpoint compatibility...")

for module_name in [
    "bert",
    "bert_encoder",
    "predictor",
    "text_encoder",
    "decoder",
]:
    module = getattr(model, module_name)

    converted = convert_checkpoint_keys(
        checkpoint[module_name]
    )

    module.load_state_dict(
        converted,
        strict=False
    )

print(" KemeTone ready!")

voice = torch.load(
    VOICE_PATH,
    map_location="cpu"
)

g2p = EgyptianG2P()


def speak(text: str, output_file="response.wav"):
    print()
    print("🗣️:", text)
    text_for_tts = text

    replacements = {
        "أهلاً بيكي": "أَهْلًا بِيكِي",
        "عاملة إيه": "عَامْلَة إِيه",
        "عامل إيه": "عَامِل إِيه",
        "النهارده": "النَّهَارْدَه",
        "إزايك": "إِزَّايِك",
        "إزيك": "إِزَّايِك",
        "أنا": "أَنَا",
        "فِقة": "فِقَّة",
        "فقة": "فِقَّة",
    }

    for original, replacement in replacements.items():
        text_for_tts = text_for_tts.replace(original, replacement)

    print(" TTS text:", text_for_tts)

    ipa = g2p(text_for_tts)

    print(" IPA:", ipa)

    with torch.no_grad():
        audio = model(
            ipa,
            voice[len(ipa) - 1]
        )

    audio = audio.detach().cpu()

    sf.write(
        output_file,
        audio.numpy(),
        24000
    )

    print(" Saved:", output_file)

    return output_file

if __name__ == "__main__":
    speak(
        "أهلاً بيكي، أنا فكة. عاملة إيه النهارده؟"
    )