import re
import json
import random
import argparse

def process_line(line):
    line = line.split("\t")[0]
    # Remove cloze tags to create the user content
    user_content = re.sub(r"{{c\d::(.*?)}}", r"\1", line).strip()
    # Assistant content is the original line with cloze tags
    assistant_content = line.strip()
    return {"user": user_content, "assistant": assistant_content}

def prepare_data(input_file, training_file, validation_file, split_ratio=0.8):
    system_content = (
        "You are an expert helping with USMLE Step 1. Convert statements into cloze-style Anki cards "
        "using {{c1::}} for key terms or concepts. Focus on high-yield information."
    )
    
    with open(input_file, "r", encoding="utf-8") as infile:
        lines = [line.strip() for line in infile if line.strip()]  # Read and filter empty lines
    
    random.shuffle(lines)  # Shuffle the lines for randomness
    
    split_index = int(len(lines) * split_ratio)
    training_lines = lines[:split_index]
    validation_lines = lines[split_index:]
    
    with open(training_file, "w", encoding="utf-8") as train_outfile, open(validation_file, "w", encoding="utf-8") as val_outfile:
        for line in training_lines:
            processed = process_line(line)
            entry = {
                "messages": [
                    {"role": "system", "content": system_content},
                    {"role": "user", "content": processed["user"]},
                    {"role": "assistant", "content": processed["assistant"]}
                ]
            }
            json.dump(entry, train_outfile)
            train_outfile.write("\n")
        
        for line in validation_lines:
            processed = process_line(line)
            entry = {
                "messages": [
                    {"role": "system", "content": system_content},
                    {"role": "user", "content": processed["user"]},
                    {"role": "assistant", "content": processed["assistant"]}
                ]
            }
            json.dump(entry, val_outfile)
            val_outfile.write("\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prepare data for fine-tuning.")
    parser.add_argument("dataset", type=str, help="Name of the dataset (e.g., 'anki').")
    args = parser.parse_args()

    dataset = args.dataset
    input_file = f"data/{dataset}.txt"
    training_file = f"anki_training_dataset.jsonl"
    validation_file = f"anki_validation_dataset.jsonl"
    prepare_data(input_file, training_file, validation_file)
    print(f"Data has been prepared and saved to {training_file} and {validation_file}")