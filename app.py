# projet API
from flask import Flask, flash, request, \
    abort, jsonify, g, render_template, redirect, send_from_directory
from werkzeug.utils import secure_filename
from uuid import uuid4
import sqlite3
import os
import time

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'svg', 'tiff', 'webp'}


DATABASE = 'database/app.db'

app = Flask(__name__, static_folder='static', static_url_path='')
# app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


def f_get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


# pour recuperer le nom des categories
def f_get_cats():
    db = f_get_db()
    cursor_categories = db.execute("SELECT name FROM categories")
    liste_cats = []
    for cat in cursor_categories:
        # print(cat)
        liste_cats.append(cat[0])
    return liste_cats


# pour recuperer le cat_id et le name des categories
def f_get_cat_name_id():
    db = f_get_db()
    cursor_cat_id = db.execute("SELECT id, name FROM categories")
    liste_cats_id = []
    for elem in cursor_cat_id:
        # print(elem)
        liste_cats_id.append([elem[0], elem[1]])
    # print(liste_cats_id)
    return liste_cats_id


# pour recuperer le path (=nom du fichier) des pictures
def f_get_pictures():
    db = f_get_db()
    cursor_pictures = db.execute("SELECT path FROM pictures \
                           ORDER BY date DESC, id DESC")
    return cursor_pictures


# pour recuperer le title (pour alt)
# et le path (=nom du fichier) des pictures
# INDEX
def f_get_pict_desc_path_index():
    db = f_get_db()
    cursor_pict_desc_path = db.execute("SELECT description, path FROM pictures\
                           ORDER BY date ASC, id DESC LIMIT 12")
    liste_desc_path = []
    for elem in cursor_pict_desc_path:
        liste_desc_path.append([elem[0], elem[1]])
    # print(liste_title_path)
    return liste_desc_path

# gallery
def f_get_pict_desc_path():
    db = f_get_db()
    cursor_pict_desc_path = db.execute("SELECT description, path FROM pictures\
                           ORDER BY id DESC, date DESC")
    liste_desc_path = []
    for elem in cursor_pict_desc_path:
        liste_desc_path.append([elem[0], elem[1]])
    # print(liste_title_path)
    return liste_desc_path



# verifie existence d'un point dans nom de fichier
# et que l'extension est autorisee
def f_allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# verifie la non existence d'un fichier avec mm nom
def f_verify_not_in_db(filename):
    pictures = f_get_pictures()
    liste_path = []
    for path in pictures:
        # print(pict[0])
        liste_path.append(path[0])
    # print(liste_path)
    return filename not in liste_path


# pour rajouter un indice aléatoire devant nom
# pour eviter doublons
def make_unique(string):
    ident = uuid4().__str__()[:8]
    return f"{ident}-{string}"


# pour recuperer la date de la nouvelle photo
def f_get_time(filepath):
    modTimesinceEpoc = os.path.getmtime(filepath)
    # Convert seconds since epoch to readable timestamp
    modificationTime = time.strftime('%Y-%d-%m',
                                     time.localtime(modTimesinceEpoc))
    return modificationTime


# INDEX
@app.route("/")
def index():
    pict_desc_path = f_get_pict_desc_path_index()
    # print(pict_desc_path)
    return render_template("index.html",
                           all_pictures=pict_desc_path)


@app.route("/showgallery")
def showgallery():
    liste_cat_id = f_get_cat_name_id()
    pict_desc_path = f_get_pict_desc_path()
    # print(pict_desc_path)
    return render_template("showgallery.html",
                           all_pictures=pict_desc_path, all_cats=liste_cat_id)


# cette route permet de dire au serveur ou aller chercher ressources
# pour les afficher dans index
@app.route('/uploads/<name>')
def upload_file(name):
    # print(app.config["UPLOAD_FOLDER"], name)
    return send_from_directory(app.config["UPLOAD_FOLDER"], name)


# pour ne montrer que les photos d'une categorie
@app.route('/<int:cat_id>')
def show_cat_files(cat_id):
    liste_cat_id = f_get_cat_name_id()
    del liste_cat_id[cat_id-1]
    # print(liste_cat_id, cat_id)
    db = f_get_db()
    cursor_pictures = db.execute("SELECT description, path\
        FROM pictures WHERE category_id = (?)", [cat_id])
    liste_desc_path = cursor_pictures.fetchall()
    return render_template("showgallerycat.html",
                           all_pictures=liste_desc_path,
                           all_cats=liste_cat_id)


# UPLOADS
# recupere le fichier envoye par formulaire
# le sauvegarde localement
# l'enregistre dans db
@app.route("/uploads", methods=["GET", "POST"])
def f_uploads():
    liste_cats = f_get_cats()
    db = f_get_db()
    to_show = False
    if request.method == "POST":
        to_show = True
        # pour recuperer photo

        # premiere verif (laurie)
        if 'nouvelle_photo' not in request.files:
            # flash('No file part')
            print('Error: no file')
            return redirect("/")

        # on recupere ce fichier
        new_photo = request.files['nouvelle_photo']

        # si le user ne selectionne pas de photo
        # verif faite par html required et js
        if new_photo.filename == '':
            return redirect("/")

        # si l'extension est ok et qu'on n'a pas de photo
        # avec le meme nom de fichier dans la db
        if new_photo and f_allowed_file(new_photo.filename):
            original_filename = secure_filename(new_photo.filename)
            # pour creer un nm de fichier unique
            unique_filename = make_unique(original_filename)
            if f_verify_not_in_db(unique_filename):
                # save sauvegarde la photo sur le disque a l'adresse specifiee
                new_photo.save(os.path.join(UPLOAD_FOLDER, unique_filename))

                # on recupere les infos des autres formulaires pour db
                new_photo_title = request.form['title_nouvelle_photo']
                new_photo_desc = request.form['desc_nouvelle_photo']
                new_photo_cats_name = request.form['cats_name_nouvelle_photo']
                # print(new_photo_title, new_photo_desc, new_photo_cats_name)

                # on recupere l'id de la categorie
                cursor_cat = db.execute("SELECT id FROM categories c \
                    WHERE c.name = (?)", [new_photo_cats_name])
                new_photo_cats_id = cursor_cat.fetchone()
                # print(new_photo_cats_id)

                # on recupere la date d'upload
                new_photo_date = f_get_time(os.path.join(UPLOAD_FOLDER,
                                                         unique_filename))
                # print(new_photo_date)

                # insertion de cette nouvelle photo ds db
                db.execute(
                    "INSERT INTO pictures (name, title, description,\
                    path, date, category_id) VALUES (?, ?, ?, ?, ?, ?)",
                    [original_filename, new_photo_title, new_photo_desc,
                     unique_filename, new_photo_date, new_photo_cats_id[0]])
                db.commit()
                # return redirect(request.url)

        # gestion des erreurs
        elif not f_verify_not_in_db(new_photo.filename):
            texte = "File name already exists, \
                you should change it!)"
            return render_template("uploads.html",
                                   all_cats=liste_cats, mytext=texte)
        elif not f_allowed_file(new_photo.filename):
            texte = "Not a valid file type. \
                Should be a .jpeg, .jpg, .png."
            return render_template("uploads.html",
                                   all_cats=liste_cats, mytext=texte)
        else:
            return redirect("/")

    # method GET (par defaut)
    # pour afficher nouvelle photo, titre, description
    if to_show:
        cursor_last_pict = db.execute(
            "SELECT title, description, path, category_id FROM pictures \
            ORDER BY date DESC, id DESC LIMIT 1")
        last_pict = cursor_last_pict.fetchone()
        print(last_pict[0], last_pict[1], last_pict[2], last_pict[3])
        return render_template(
            "uploads.html", all_cats=liste_cats, last_pict=last_pict[2],
            last_pict_title=last_pict[0], last_pict_desc=last_pict[1], last_pict_cat=last_pict[3])
    else:
        # method GET (par defaut) qui s'affichera avant le POST
        return render_template("uploads.html", all_cats=liste_cats)


# SHOW une photo demandee, titre, description
# et les commentaires (avec un auteur et une adresse mail)
@app.route("/showpicture/<filename>", methods=["GET", "POST"])
def f_show_given(filename):
    # print(filename)
    db = f_get_db()
    # pour recuperer nouveau commentaire
    if request.method == "POST":
        comment = request.form['comment_given_picture']
        user = request.form['user_name']
        mail = request.form['user_mail']
        # print(comment, user, mail)
        cursor_pictid = db.execute(
            "SELECT id FROM pictures WHERE path = (?)", [filename])
        pictid = cursor_pictid.fetchone()
        # print(pictid[0])
        db.execute(
            "INSERT INTO comments (comment, user_name, user_mail, \
                picture_id) VALUES (?, ?, ?, ?)",
            [comment, user, mail, pictid[0]])
        db.commit()
        

    # pour afficher les anciens commentaires
    cursor_picture = db.execute(
        "SELECT id, title, description, path \
            FROM pictures p WHERE p.path = (?)",
        [filename])
    given_picture = cursor_picture.fetchone()
    cursor_comments = db.execute(
        "SELECT comment, user_name, user_mail \
            FROM comments WHERE picture_id = (?) \
                ORDER BY id DESC",
        [given_picture[0]])
    liste_comments = []
    for comment in cursor_comments:
        # print(comment)
        liste_comments.append([comment[0], comment[1], comment[2]])
    # print(liste_comments)
    return render_template(
        "showpicture.html", given_picture=given_picture[3],
        given_title=given_picture[1], given_desc=given_picture[2],
        given_comments=liste_comments)


if __name__ == "__main__":
    app.run(debug=True)
