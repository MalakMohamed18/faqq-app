import torch
import soundfile as sf

from kokoro import KModel
from kemetone.g2p import EgyptianG2P


MODEL_PATH = "kemetone.pth"
CONFIG_PATH = "config.json"
VOICE_PATH = "voices/kemetone.pt"

TEXT = "النَّهَارْدَه الْجَوّ حِلْو أَوِي"
OUTPUT = "kemetone-compat-test.wav"


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


print(" KEMETONE COMPATIBILITY TEST")
print()

print("1️ Loading model...")

model = KModel(
    repo_id="Rabe3/kemetone",
    config=CONFIG_PATH,
    model=MODEL_PATH,
).eval()

checkpoint = torch.load(
    MODEL_PATH,
    map_location="cpu",
    weights_only=True,
)

print(" Model loaded")
print()


print(" Converting checkpoint weight_norm keys...")

for module_name in [
    "bert",
    "bert_encoder",
    "predictor",
    "text_encoder",
    "decoder",
]:

    converted = convert_checkpoint_keys(
        checkpoint[module_name]
    )

    module = getattr(model, module_name)

    result = module.load_state_dict(
        converted,
        strict=False,
    )

    print(f"\n[{module_name}]")
    print("missing:", len(result.missing_keys))
    print("unexpected:", len(result.unexpected_keys))

    if result.missing_keys:
        print("Missing examples:")
        print(*result.missing_keys[:10], sep="\n")

    if result.unexpected_keys:
        print("Unexpected examples:")
        print(*result.unexpected_keys[:10], sep="\n")


print()
print(" Running Egyptian G2P...")

g2p = EgyptianG2P()
ipa = g2p(TEXT)

print("IPA:")
print(ipa)
print()


print(" Synthesizing...")

voice = torch.load(
    VOICE_PATH,
    map_location="cpu",
)

with torch.no_grad():
    audio = model(
        ipa,
        voice[len(ipa) - 1],
    )

audio = audio.detach().cpu()

print("Audio shape:", audio.shape)
print(
    "RMS:",
    torch.sqrt(torch.mean(audio.float() ** 2)).item()
)

sf.write(
    OUTPUT,
    audio.numpy(),
    24000,
)

print()

print(" DONE")

print(f" {OUTPUT}")