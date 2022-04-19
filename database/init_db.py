import sqlite3


DATABASE = 'app.db'
db = sqlite3.connect(DATABASE)

cursor = db.cursor()

# Creation of table "categories".
cursor.execute('DROP TABLE IF EXISTS categories')
cursor.execute("""CREATE TABLE categories
                            (id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name VARCHAR(200) NOT NULL)""")

# We seed the table with initial values.
# Here we insert 4 categories:
for name in ["Summer",
             "Autumn",
             "Winter",
             "Spring"]:
    cursor.execute("INSERT INTO categories (name) VALUES (?)", (name,))

# Creation of table "pictures"
cursor.execute('DROP TABLE IF EXISTS pictures')
cursor.execute("""CREATE TABLE pictures (id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(200) NOT NULL,
                title VARCHAR(20) NOT NULL,
                description VARCHAR(70) NOT NULL,
                path VARCHAR(100) NOT NULL,
                date DATE NOT NULL,
                category_id INTEGER,
                    CONSTRAINT fk_categories
                    FOREIGN KEY (category_id)
                    REFERENCES categories(category_id))""")

# We seed the table with initial values.
for data in [
    ("spring-3.png", "Title spring-3", "Desc spring-3",
     "spring-3.png", "2020-18-06", 4),
    ("spring-2.jpg", "Title spring-2", "Desc spring-2",
     "spring-2.jpg", "2020-18-06", 4),
    ("spring-1.jpg", "Title spring-1", "Desc spring-1",
     "spring-1.jpg", "2020-18-06", 4),
    ("winter-3.png", "Title winter-3", "Desc winter-3",
     "winter-3.png", "2020-18-06", 3),
    ("winter-2.jpg", "Title winter-2", "Desc winter-2",
     "winter-2.jpg", "2020-18-06", 3),
    ("winter-1.png", "Title winter-1", "Desc winter-1",
     "winter-1.png", "2020-18-06", 3),
    ("autumn-3.jpg", "Title autumn-3", "Desc autumn-3",
     "autumn-3.jpg", "2020-18-06", 2),
    ("autumn-2.jpg", "Title autumn-2", "Desc autumn-2",
     "autumn-2.jpg", "2020-18-06", 2),
    ("autumn-1.jpg", "Title autumn-1", "Desc autumn-1",
     "autumn-1.jpg", "2020-18-06", 2),
    ("summer-3.jpg", "Title summer-3", "Desc summer-3",
     "summer-3.jpg", "2020-18-06", 1),
    ("summer-2.jpg", "Title summer-2", "Desc summer-2",
     "summer-2.jpg", "2020-18-06", 1),
    ("summer-1.jpg", "Title summer-1", "Desc summer-1",
     "summer-1.jpg", "2020-18-06", 1)
]:
    cursor.execute(
        "INSERT INTO pictures (name, title, description, path, date, \
            category_id) VALUES (?, ?, ?, ?, ?, ?)", data)

# Creation of table "comments".
cursor.execute('DROP TABLE IF EXISTS comments')
cursor.execute("""CREATE TABLE comments
                            (id INTEGER PRIMARY KEY AUTOINCREMENT,
                            comment VARCHAR(200) NOT NULL,
                            user_name VARCHAR(100) NOT NULL,
                            user_mail VARCHAR(25) NOT NULL,
                            picture_id INTEGER,
                            CONSTRAINT fk_pictures
                                FOREIGN KEY (picture_id)
                                REFERENCES pictures(picture_id))""")

for commentaries in [
    ("Oh la vache!", "Bob", "toto@mail", 1),
    ("Quelle belle image", "Pierre", "toti@mail", 7),
    ("J'aurais aimé y être", "Joe", "toti@mail", 1),
    ("Joli!", "Lucienne", "toto@mail", 7),
    ("yeah yeah yeah", "Gaga", "toto@mail", 7),
    ("Trop bien", "Barnabe", "toti@mail", 8),
    ("Quelle taule!", "toto", "toto@mail", 10)
]:
    cursor.execute(
        "INSERT INTO comments (comment, user_name, user_mail, picture_id) \
            VALUES (?, ?, ?, ?)", commentaries)

# We save our changes into the database file
db.commit()

# We close the connection to the database
db.close()
