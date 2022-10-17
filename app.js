// State
let state = {
  currentPost: {
    text: "",
    uploadedImageSrc: "",
  },
};

// Elements Selectors
const mainContainerSelector = document.querySelector(".main_container");
const addButtonSelector = document.querySelector(".plus_icon_container");
const footerContainerSelector = document.querySelector(".footer_container");
const modalContainerSelector = document.querySelector(".modal");
const closeButtonSelector = document.querySelector(".close_modal");
const uploadImageSelector = document.querySelector("#images");
const postContainerSelector = document.querySelector(".posts");
const publishButtonSelector = document.querySelector("#publish_btn");
const textareaSelector = document.querySelector("#textarea");
const fileUploadArea = document.querySelector(".file-area");
const imageNameSelector = document.querySelector("#image_name_container");

// Event Listeners
function loadEventsListener() {
  addButtonSelector.addEventListener("click", loadModal);
  uploadImageSelector.addEventListener("change", uploadImageHandler);
  publishButtonSelector.addEventListener("click", publishPost);
  closeButtonSelector.addEventListener("click", closeModalAndRemoveBlur);
  imageNameSelector.addEventListener("click", deleteLoadedImage);
  postContainerSelector.addEventListener("click", handleLikeButton);
  textareaSelector.addEventListener("input", addTextToState);
}

// functions
function loadModal() {
  modalContainerSelector.classList.add("show_modal");
  if (modalContainerSelector.classList.contains("show_modal")) {
    mainContainerSelector.classList.add("blur");
  }
  changeFileUploadDisplay("block");
  changeImageNameContainerDisplay("none");
  changeAddButtonDisplay("none");
}

function uploadImageHandler() {
  let loaded_image = "";
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    loaded_image = reader.result;
    document.querySelector(
      "#preview_image"
    ).style.backgroundImage = `url(${loaded_image})`;
    reader.readAsDataURL(this.files[0]);
  });
  changeImageNameContainerDisplay("block");
  imageNameSelector.innerHTML = ` <div id="image_name">${this.files[0].name}</div>
  <button class="delete_icon">
    <img src="./images/delete-icon.png" alt="delete icon" />
  </button>`;
  changeFileUploadDisplay("none");
  state.currentPost.uploadedImageSrc = URL.createObjectURL(this.files[0]);
}

function publishPost(e) {
  e.preventDefault();
  changeAddButtonDisplay("block");

  if (state.currentPost.text && state.currentPost.uploadedImageSrc) {
    modalContainerSelector.classList.remove("show_modal");
    removeBlurFromMainContainer();
    state.currentPost.text = textareaSelector.value;
    addPostToUI();
    closeModalAndRemoveBlur();
    clearForm();
    clearCurrentStateValues();
  } else {
    alert("Please provide an image and text...");
  }
}

function addPostToUI() {
  const postsLength = document.querySelectorAll(".post").length;
  if (state.currentPost.text || state.currentPost.uploadedImageSrc) {
    let newPost = `   
  <div class="post">
        <img src="${state.currentPost.uploadedImageSrc}" id="image">     
        <div class="outline_circle" style="top: calc(${
          postsLength * 431 // 361 + 70
        }px + 304px);">
        <img id="like_icon"  src="./images/heart-icon.png" alt="like icon" />    
        </div> 
      <div id="post_text_container">
        <p class="post_text">${state.currentPost.text}</p>
      </div>
      <div class="post_date">${generateCurrentDate()}</div>
    </div>
   `;

    document.querySelector(".posts").insertAdjacentHTML("afterbegin", newPost);
  }
}

function closeModalAndRemoveBlur() {
  modalContainerSelector.classList.remove("show_modal");
  removeBlurFromMainContainer();
  changeAddButtonDisplay("block");
}

function deleteLoadedImage(e) {
  if (e.target.parentElement.classList.contains("delete_icon")) {
    changeFileUploadDisplay("block");
    changeImageNameContainerDisplay("none");
    clearForm();
    clearCurrentStateValues();
  }
}

function handleLikeButton(e) {
  // make sure to not able to like when browse an image
  if (modalContainerSelector.classList.contains("show_modal")) {
    return;
  } else {
    if (e.target.classList.contains("outline_circle")) {
      e.target.classList.remove("outline_circle");
      e.target.classList.add("circle");
    } else if (e.target.classList.contains("circle")) {
      e.target.classList.remove("circle");
      e.target.classList.add("outline_circle");
    } else if (e.target.parentElement.classList.contains("outline_circle")) {
      e.target.parentElement.classList.remove("outline_circle");
      e.target.parentElement.classList.add("circle");
    } else if (e.target.parentElement.classList.contains("circle")) {
      e.target.parentElement.classList.remove("circle");
      e.target.parentElement.classList.add("outline_circle");
    }
  }
}

function addTextToState(e) {
  state.currentPost.text = e.target.value;
}

function clearForm() {
  textareaSelector.value = "";
  uploadImageSelector.value = "";
  removeBlurFromMainContainer();
}

function clearCurrentStateValues() {
  state.currentPost.text = "";
  state.currentPost.uploadedImageSrc = "";
}

function generateCurrentDate() {
  var options = { year: "numeric", month: "long", day: "numeric" };
  var today = new Date();
  const date = today.toLocaleDateString("en-US", options);
  return date;
}

function changeFileUploadDisplay(displayStatus) {
  fileUploadArea.style.display = displayStatus;
}

function changeImageNameContainerDisplay(displayStatus) {
  imageNameSelector.style.display = displayStatus;
}

function changeAddButtonDisplay(displayStatus) {
  addButtonSelector.style.display = displayStatus;
}

function removeBlurFromMainContainer() {
  mainContainerSelector.classList.remove("blur");
}

loadEventsListener();
