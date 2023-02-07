// import heic2any from "heic2any";

const venue_links = [
  {
    name: "facebook",
    icon: "/links/facebook.jpg",
  },
  {
    name: "google",
    icon: "/links/google.jpg",
  },
  {
    name: "instagram",
    icon: "/links/instagram.jpg",
  },
  {
    name: "invino",
    icon: "/links/invino.jpg",
  },
  {
    name: "trip advisor",
    icon: "/links/trip-advisor.jpg",
  },
  {
    name: "yelp",
    icon: "/links/yelp.jpg",
  },
];

// function compressImage(imageData: File): Promise<File> {
//   return new Promise((resolve, reject) => {
//     if (imageData.type.toLowerCase() == "image/heic") {
//       heic2any({
//         blob: imageData,
//         toType: "image/jpeg",
//         quality: 0.5,
//       }).then((newImage) => {
//         let file = new File([newImage], "avatar.jpg", { type: "image/jpeg" });
//         resolve(file);
//       });
//     }
//
//     var reader = new FileReader();
//     reader.onload = function (readerEvent: any) {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       const img = new Image();
//       img.onload = () => {
//         const width = img.width;
//         const height = img.height;
//         canvas.width = width;
//         canvas.height = height;
//         ctx?.drawImage(img, 0, 0, width, height);
//         const data = canvas.toDataURL("image/jpeg", 0.5);
//         fetch(data)
//           .then((res) => res.blob())
//           .then((blob) => {
//             console.log(blob);
//             let file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
//             resolve(file);
//           });
//       };
//       img.src = readerEvent.target.result;
//     };
//     reader.readAsDataURL(imageData);
//   });
// }

export {
  venue_links,
  // compressImage
};
