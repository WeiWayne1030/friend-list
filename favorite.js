//設定網址
const BASE_URL = "https://user-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/users/"

const users = JSON.parse(localStorage.getItem("favoriteUsers")) || []
const dataPanel = document.querySelector('#data-panel')

let filteredFriends = []


function renderUserList(data) {
  let rawHTML = ''
  //processing
  //需要的資料：id, name, avatar, country, age ( birth, country, eamil,created_at後面會用到)
  // 在img標籤新增data-id='${item.id}'，後面事件監聽器裡的event.target.dataset.id抓取
  // 在Template Literals裡用三元運算子判斷男女，放入不同的fontawsome圖
  data.forEach((item) => {
    rawHTML += `
    <div class="col-2 m-2 p-2 card shadow rounded " style="width: 300px;">
      <div>
        <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
      </div>
      <img src="${item.avatar}"
        class="card-img-top btn btn-outline-light btn-show-user rounded-circle" data-bs-toggle="modal" data-bs-target="#user-modal"
        data-id="${item.id}" alt="User Image" >
      <div class="card-body">
        <h5 class="card-title text-center fw-bold">${item.name} ${item.surname}</h5>
        <h5 class="card-title text-center fw-bold">${item.region}</h5>
        <h5 class="card-title text-center fw-bold">
          <i class="${item.gender === "female" ? "fa-solid fa-person-dress" : "fa-solid fa-person"}"> Age:${item.age}</i>
        </h5>
      </div>
    </div>
    `}
  );
  dataPanel.innerHTML = rawHTML
}

function showUserModal(id) {
  const modalName = document.querySelector("#user-modal-name");
  const modalImage = document.querySelector("#user-modal-image");
  const modalGender = document.querySelector("#user-modal-gender");
  const modalAge = document.querySelector("#user-modal-age");
  const modalRegion = document.querySelector("#user-modal-region");
  const modalBirthday = document.querySelector("#user-modal-birthday");
  const modalEmail = document.querySelector("#user-modal-email");
  const modalUpdatedDate =document.querySelector("#user-modal-updated_at")

  axios.get(INDEX_URL + id).then((response) =>{
    const data = response.data;
    modalName.innerText = data.name + " " + data.surname;
    modalGender.innerText = "Gender: " + data.gender;
    modalAge.innerText = "Age: " + data.age;
    modalRegion.innerText = "Region: " + data.region;
    modalBirthday.innerText = "Birthday: " + data.birthday;
    modalEmail.innerText = "Email: " + data.email;
    modalUpdatedDate.innerText = "Updated_Date" + data.updated_at
    modalImage.innerHTML = `<img src="${data.avatar}" alt="user-image" class="'img-fluid justify-content-center" style="height: 417px">`;
  })
}

//刪除favorite
function removeFromFavorite(id) {
  if (!users || !users.length) return 

  //透過 id 找到要刪除電影的 index
  const userIndex = users.findIndex((user) => user.id === id)
  if(userIndex === -1) return

  //刪除該筆電影
  users.splice(userIndex,1)

  //存回 local storage
  localStorage.setItem('favoriteUsers', JSON.stringify(users))

  //更新頁面
  renderUserList(users)
}



//listen to data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderUserList(users)

