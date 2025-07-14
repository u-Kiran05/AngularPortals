from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "facebook/bart-large-mnli"
save_path = "./local_models/bart-large-mnli"

# Download and save
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

tokenizer.save_pretrained(save_path)
model.save_pretrained(save_path)
print(" Model saved locally at", save_path)
