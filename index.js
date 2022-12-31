//設定網址
const BASE_URL = "https://user-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/users/"
//設定畫面最多為12個users(圖)
const USER_PER_PAGE = 12
//設立一個空陣列將API資料放進裡面
const userList = []
//蒐藏名單
const list = JSON.parse(localStorage.getItem("favoriteUsers")) || []
// 存放搜尋後的結果
let filteredUsers = []

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput =document.querySelector("#search-input")
const pagigater = document.querySelector('#paginator')
let pageCurrent = 1

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
        <i class="${
                  list.some((user) => user.id === item.id)
                    ? "fa-solid text-danger"
                    : "fa-regular"
                } fa-heart fa-2x btn btn-add-favorite" data-id="${item.id}"></i>
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

// 分頁器渲染，產生分頁的數量
function renderPaginator(amount) {
  let rawHTML = "";
  let pageNum = Math.ceil(amount / USER_PER_PAGE);

  for (let page = 1; page <= pageNum; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>`;
  }

  paginator.innerHTML = rawHTML;
  paginator.firstElementChild.classList.add("active")
}

// 分頁內容擷取函式，把每頁要呈現的人物擷取出來
function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : userList
  const startIndex = (page - 1) * USER_PER_PAGE;
  return data.slice(startIndex, startIndex + USER_PER_PAGE);
}



//匯入usermodal
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

function addToFavorite(id){
  const user = userList.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('the user is already added in your favorite list!')
  }
  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
  renderUserList(getUsersByPage(pageCurrent))
}




//綁定datapanel事件
dataPanel.addEventListener('click', function onPanelClick(event){
  if(event.target.matches(".btn-show-user")){
    showUserModal(event.target.dataset.id)
  } else if (event.target.matches(".btn-add-favorite")){
    addToFavorite(Number(event.target.dataset.id))
  }
})

//綁定searchform事件
searchForm.addEventListener('submit', function onSearchSubmitted(event){
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredUsers = userList.filter((user) => 
    (user.name + ' ' + user.surname).toLowerCase().includes(keyword))
// 只要過濾後沒東西或輸入空值，就跳出警告視窗
  if (filteredUsers.length === 0) {
    return alert("Cannot find friends with keyword: " + keyword);
  }

  renderPaginator(filteredUsers.length);
  renderUserList(getUsersByPage(1));
});

// listen to paginator
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUsersByPage(page))
})


//匯入api資料
axios.get(INDEX_URL)
  .then((response) => {
    userList.push(...response.data.results)
    renderPaginator(userList.length)
    renderUserList(getUsersByPage(1)) 
  })
  .catch((err) => console.log(err))