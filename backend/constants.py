"""
Canonical Bible book lists and denomination configuration.
"""

PROTESTANT_BOOKS = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
    "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
    "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
    "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
    "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
    "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
    "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
    "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
    "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
    "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
    "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
    "James", "1 Peter", "2 Peter", "1 John", "2 John",
    "3 John", "Jude", "Revelation"
]

CATHOLIC_ADDITIONAL = [
    "Tobit", "Judith", "1 Maccabees", "2 Maccabees",
    "Wisdom", "Sirach", "Baruch"
]

DENOMINATIONS = ["Protestant", "Catholic", "Orthodox", "Non-denominational"]


def get_book_list(denomination: str) -> list:
    """Return the appropriate book list based on denomination."""
    if denomination in ("Catholic", "Orthodox"):
        return PROTESTANT_BOOKS + CATHOLIC_ADDITIONAL
    return PROTESTANT_BOOKS
