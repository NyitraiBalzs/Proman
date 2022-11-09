from flask import Flask, render_template, url_for, request, redirect, session, escape
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()
app.secret_key = b'_5#y2L"F4Q8z\xec]/'


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and card
    """

    return render_template('index.html', session=session)

@app.route('/')
def login_true():
    if 'username' in session:
        return 'Logged in as %s' % escape(session['username'])
    return 'You are not logged in'

@app.route("/api/boards", methods=['POST', 'GET'])
@json_response
def get_boards():
    """
    All the boards
    """
    if request.method == 'POST':
        data = request.get_json()
        queries.add_new_board(data['title'])
    return queries.get_boards()

@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belong to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route("/rename_board", methods=["PATCH"])
@json_response
def rename_post():
    if request.method == "PATCH":
        table_data = request.get_json()
        return queries.update_title(table_data)


@app.route("/api/rename_column", methods=["PATCH"])
@json_response
def rename_column():
    if request.method == "PATCH":
        col_data = request.get_json()
        return queries.update_column(col_data)


@app.route("/change_status", methods=["PATCH"])
@json_response
def change_status():
    if request.method == "PATCH":
        table_data = request.get_json()
        return queries.change_status(table_data)


@app.route("/api/boards/<int:board_id>/new_card/", methods = ["GET", "POST"])
@json_response
def add_new_card(board_id: int):
    if request.method == "POST":
        insert_values = request.get_json()
        return queries.add_new_card_to_board(board_id, "cards", insert_values)


@app.route("/api/cards/delete/", methods=["GET", "POST", "DELETE"])
@json_response
def delete_card():
    if request.method == "DELETE":
        deleted_card = request.get_json()
        return queries.delete(deleted_card)



@app.route("/api/boards/<board_id>", methods=["DELETE"])
@json_response
def delete_board(board_id):
    return queries.delete_board(board_id)


@app.route('/api/statuses', methods=['GET', 'POST'])
@json_response
def get_responses():

    if request.method == 'POST':
        title = request.get_json()
        queries.add_new_status(title)
        return queries.get_all_statuses()

    return queries.get_all_statuses()


@app.route('/login/process', methods=['POST','GET'])
def login_data_process():
    username = request.form['username']
    password = request.form['password']
    data = queries.login(username,password)
    print(data)

    if data != None:
        session['username'] = request.form['username']

    return redirect('/')


@app.route('/register', methods=['POST', 'GET'])
def register():
    username = request.form['username']
    password = request.form['password']
    queries.register(username,password)
    return redirect('/')


@app.route('/logout', methods=['POST','GET'])
def logout():
    print(session)
    session.pop('username',)
    return redirect(url_for('index'))

def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
