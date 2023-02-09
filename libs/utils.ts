// import heic2any from "heic2any";

import { count } from "console";
import { calcLength } from "framer-motion";
import { getDefaultFormatCodeSettings } from "typescript";
import { VenueTypeExpanded } from "../types/VenueVisit";

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
const monthsShorthand = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function generateLabels(from: number | string, to: number | string) {
  let startTime = new Date(from);
  let endTime = new Date(to);
  const labels: string[] = [];
  const labelsFormated = [];

  while (startTime <= endTime) {
    let d = new Date(startTime);
    let timestamp = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
    let currentDay = d.getDate();
    let currentMonth = monthsShorthand[new Date(startTime).getMonth()];
    labelsFormated.push(`${currentDay}. ${currentMonth}`);
    labels.push(timestamp);
    startTime.setDate(startTime.getDate() + 1);
  }

  return { labels, labelsFormated };
}

function prepareVenueChartData(
  data: VenueTypeExpanded[],
  from: number | string,
  to: number | string
): {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
} {
  //prepare labels for given timespan
  const { labels, labelsFormated } = generateLabels(from, to);

  //prepare datasets for the venue
  const datasetCountObj: { [x: string]: number } = {};
  labels.forEach((labelTimestamp, i) => {
    if (!datasetCountObj.hasOwnProperty(labels[i])) {
      datasetCountObj[labels[i]] = 0;
    }
    data.forEach((visit) => {
      let d = new Date(visit.created_at || 0);
      let visitTimestamp =
        d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
      if (labelTimestamp === visitTimestamp) {
        datasetCountObj[labels[i]] = datasetCountObj[labels[i]] + 1;
      }
    });
  });
  const dataset = Object.values(datasetCountObj);
  return {
    labels: labelsFormated,
    datasets: [
      {
        label: "Venue visits",
        data: dataset,
      },
    ],
  };
}

function prepareDeviceChartData(
  data: VenueTypeExpanded[],
  from: number | string,
  to: number | string
) {
  //prepare labels for given timespan
  const { labels, labelsFormated } = generateLabels(from, to);
  console.log(data);

  // {
  //   labels: labelsFormated,
  //   datasets: [
  //     {
  //       label: "Card 1",
  //       data: [1,2,33,0,3]
  //     },
  //     {
  //       label: "Card 2",
  //       data: [1,2,33,0,3]
  //     }

  //   ]
  // }

  const datasetAcc: string[] = [];
  let datasets: { label: string; data: number[]; nfc_id?: string }[] = [];

  data.forEach((device) => {
    if (!datasetAcc.includes(device?.nfcs?.title || "")) {
      datasetAcc.push(device?.nfcs?.title || "");
      datasets.push({
        nfc_id: device?.nfc_id,
        label: device?.nfcs?.title || "",
        data: [],
      });
    }
  });

  datasets = datasets.map((nfc) => {
    let acc = Array(labels.length).fill(0);
    labels.forEach((labelTimestamp, i) => {
      data.forEach((click) => {
        let d = new Date(click.created_at || 0);
        let clickTimestamp =
          d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
        if (labelTimestamp === clickTimestamp && nfc.nfc_id === click.nfc_id) {
          acc[i] = acc[i] + 1;
        }
      });
    });
    nfc.data = acc;
    return nfc;
  });

  if (datasets.length == 0) {
    datasets = [
      {
        label: "No Data",
        data: [],
      },
    ];
  }

  return {
    labels: labelsFormated,
    datasets,
  };
}

export {
  venue_links,
  prepareVenueChartData,
  prepareDeviceChartData as prepareLinkChartData,
  // compressImage
};
