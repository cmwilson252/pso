let CARD_TEMPLATE = `<div class="card">
                          <div class="image">
                            <img src="__IMAGE__" height="200" width="200">
                          </div>
                          <div class="content">
                            <div class="header">__NAME__</div>
                            <div class="meta">
                              __SERVERS__
                            </div>
                            <div class="description" style="color: #FF5733">
                              __DESC_RAW_
                            </div>
                          </div>
                          <div class="extra content">
                            <span style="color:red;" class="right floated">
                              __TEAMS__
                            </span>
                            <span style="color:green;">
                            <i>
                              __CLASSES__
                            </i>
                            </span>
                          </div>
                        </div>`
let IMAGE_FOLDER_URI = "./assets/images/players/";

function buildPlayerCard(player) {
    let html = CARD_TEMPLATE.substring(0);
    html = html.replace("__CLASSES__", player["classes"]);
    html = html.replace("__IMAGE__", IMAGE_FOLDER_URI + player["image"]);
    html = html.replace("__NAME__", player["name"]);
    html = html.replace("__SERVERS__", player["servers"]);
    html = html.replace("__DESC_RAW_", player["raw_desc"]);
    html = html.replace("__TEAMS__", player["teams"]);
    return html;
}

function insertPlayerCards() {
    let html = "";
    for (let i = 0; i < Players.length; i++) {
        html += buildPlayerCard(Players[i]);
    }
    $('#players').empty();
    $('#players').append(html);
}

insertPlayerCards();