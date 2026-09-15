import torch
import soundfile as sf

from kokoro import KModel
from kemetone import EgyptianG2P



print("🇪🇬 FEQQA — KEMETONE TTS TEST")

print()

print("Loading Egyptian Arabic model...")

model = KModel(
    repo_id="Rabe3/kemetone",
    config="config.json",
    model="kemetone.pth"
).eval()

voice = torch.load("voices/kemetone.pt")

print("Model loaded!")
print()

text = "النهارده مبيعاتك كويسة، وأنا جاهز أساعدك."

print(" Generating:")
print(text)
print()

g2p = EgyptianG2P()
ipa = g2p(text)

audio = model(
    ipa,
    voice[len(ipa) - 1]
)

sf.write(
    "test_kemetone.wav",
    audio.numpy(),
    24000
)


print(" DONE!")
print(" test_kemetone.wav")
