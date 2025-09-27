# Zettelkasten Automations

An Obsidian plugin that helps you put the principles of the Zettelkasten method into practice by automating common note-taking tasks. Based on the note structure from this [YouTube video by Wanderloots](https://www.youtube.com/watch?v=00LKsV8h6zY).

## 📚 Related reads
- [How to take smart notes](https://www.goodreads.com/book/show/34507927-how-to-take-smart-notes?from_search=true&from_srp=true&qid=JUPrcUNkKv&rank=1)
- [Building a second brain](https://www.goodreads.com/book/show/59616977-building-a-second-brain?ref=rae_2)

## ✨ What it does

1. Lets you define custom note types (e.g. literature notes, permanent notes, fleeting notes, or atoms/molecules/alloys as in [this guide](https://www.youtube.com/watch?v=00LKsV8h6zY)) with their own folders and templates.

2. Adds commands to quickly create notes from templates — directly from the Command Palette.

3. Supports a special *Currently Reading* note: when set, your templates can automatically link to the active book.

![obsidian-zettelkasten-showcase](https://github.com/user-attachments/assets/094a54c3-5ed4-4383-b0b6-656a2e7ea0a1)

## 🚀 How to use

1. Configure your note types in the plugin’s settings:
	- Choose a folder for each type (e.g. Literature, Permanent, Fleeting).
	- Assign a template file for each

2. Set your currently reading book from the Command Palette.

3. Templates can use the `$currently_reading` placeholder to auto-insert the active book link.

4. Create new notes quickly using the provided commands — the plugin will fill in the right template and put the note in the right place automatically.

## ⚙️ Settings

Configure multiple note types, each with its own template, location:

<img width="1144" height="1052" alt="Screenshot 2025-09-27 at 19 45 41" src="https://github.com/user-attachments/assets/0b809075-d74e-4d65-919d-d832569a7b83" />

## Todo's

- [ ] add the possibility to template `created_at` and `updated_at` placeholders in templates
- [ ] redesign the settings UI for improved looks & UX
