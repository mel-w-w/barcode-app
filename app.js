
console.log("app.js loaded");



/* ==========================================
   SCREENS
========================================== */

const homeScreen =
  document.getElementById("homeScreen");

const addItemScreen =
  document.getElementById("addItemScreen");

const itemCreatedScreen =
  document.getElementById("itemCreatedScreen");



/* ==========================================
   BUTTONS
========================================== */

const addItemButton =
  document.getElementById("addItemButton");

const scanButton =
  document.getElementById("scanButton");

const backButton =
  document.getElementById("backButton");

const createdBackButton =
  document.getElementById("createdBackButton");

const doneButton =
  document.getElementById("doneButton");

const shareButton =
  document.getElementById("shareButton");

const downloadButton =
  document.getElementById("downloadButton");

const printButton =
  document.getElementById("printButton");

const itemForm =
  document.getElementById("itemForm");



/* ==========================================
   TEMPORARY BARCODE NUMBER
========================================== */

let nextItemId = 1;



/* ==========================================
   HOME → ADD ITEM
========================================== */

addItemButton.addEventListener(
  "click",
  function () {

    homeScreen.classList.add("hidden");

    addItemScreen.classList.remove("hidden");

  }
);



/* ==========================================
   BACK → HOME
========================================== */

backButton.addEventListener(
  "click",
  function () {

    addItemScreen.classList.add("hidden");

    homeScreen.classList.remove("hidden");

  }
);



/* ==========================================
   SCANNER
========================================== */

const scannerScreen =
  document.getElementById("scannerScreen");

const scannerBackButton =
  document.getElementById("scannerBackButton");

const scanResult =
  document.getElementById("scanResult");


let html5QrCode = null;


/* ==========================================
   OPEN SCANNER
========================================== */

scanButton.addEventListener(
  "click",
  function () {

    homeScreen.classList.add("hidden");

    scannerScreen.classList.remove("hidden");

    startScanner();

  }
);



/* ==========================================
   START SCANNER
========================================== */

function startScanner() {

  scanResult.textContent =
    "Point your camera at a barcode.";


  html5QrCode =
    new Html5Qrcode("reader");


  html5QrCode.start(

    {
      facingMode: "environment"
    },

    {
      fps: 10,

      qrbox: {
        width: 300,
        height: 150
      }

    },

    function (
      decodedText,
      decodedResult
    ) {

      console.log(
        "Barcode scanned:",
        decodedText
      );


      scanResult.textContent =
        "Barcode: " +
        decodedText;


      stopScanner();

    },

    function (errorMessage) {

      /*
        This fires constantly while
        the camera is looking for a
        barcode.

        We don't need to display
        these messages.
      */

    }

  ).catch(
    function (error) {

      console.error(
        "Unable to start scanner:",
        error
      );


      scanResult.textContent =
        "Unable to access the camera. Please check your camera permissions.";

    }
  );

}



/* ==========================================
   STOP SCANNER
========================================== */

function stopScanner() {

  if (
    html5QrCode &&
    html5QrCode.isScanning
  ) {

    html5QrCode.stop()

      .then(
        function () {

          html5QrCode.clear();

        }
      )

      .catch(
        function (error) {

          console.error(
            "Could not stop scanner:",
            error
          );

        }
      );

  }

}



/* ==========================================
   BACK FROM SCANNER
========================================== */

scannerBackButton.addEventListener(
  "click",
  function () {

    stopScanner();

    scannerScreen.classList.add(
      "hidden"
    );

    homeScreen.classList.remove(
      "hidden"
    );

  }
);



/* ==========================================
   CREATE ITEM
========================================== */

itemForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();


    /* Create barcode */

    const barcodeNumber =
      String(nextItemId).padStart(6, "0");

    nextItemId++;


    /* Get information */

    const supplier =
      document.getElementById(
        "supplier"
      ).value;


    const poNumber =
      document.getElementById(
        "poNumber"
      ).value;


    const date =
      document.getElementById(
        "itemDate"
      ).value;


    const itemName =
      document.getElementById(
        "itemName"
      ).value;


    const code =
      document.getElementById(
        "itemCode"
      ).value;


    const cartonNumber =
      document.getElementById(
        "cartonNumber"
      ).value;


    const quantity =
      document.getElementById(
        "quantity"
      ).value;



    /* Display information */

    document.getElementById(
      "displayItemName"
    ).textContent =
      itemName;


    document.getElementById(
      "displaySupplier"
    ).textContent =
      supplier;


    document.getElementById(
      "displayPoNumber"
    ).textContent =
      poNumber;


    document.getElementById(
      "displayDate"
    ).textContent =
      date;


    document.getElementById(
      "displayCode"
    ).textContent =
      code;


    document.getElementById(
      "displayCartonNumber"
    ).textContent =
      cartonNumber;


    document.getElementById(
      "displayQuantity"
    ).textContent =
      quantity;



    /* ========================================
       GENERATE BARCODE
    ======================================== */

    if (
      typeof JsBarcode ===
      "undefined"
    ) {

      alert(
        "Barcode generator failed to load."
      );

      return;

    }


    JsBarcode(
      "#barcode",
      barcodeNumber,
      {

        format: "CODE128",

        displayValue: true,

        width: 2,

        height: 120,

        margin: 10

      }
    );



    /* ========================================
       SHOW CREATED SCREEN
    ======================================== */

    addItemScreen.classList.add(
      "hidden"
    );

    itemCreatedScreen.classList.remove(
      "hidden"
    );

  }
);



/* ==========================================
   CREATE COMPLETE LABEL
========================================== */

function createLabelImage() {

  return new Promise(
    function (resolve) {


      /* ======================================
         GET INFORMATION
      ====================================== */

      const barcode =
        document.getElementById(
          "barcode"
        );


      const supplier =
        document.getElementById(
          "displaySupplier"
        ).textContent;


      const poNumber =
        document.getElementById(
          "displayPoNumber"
        ).textContent;


      const itemName =
        document.getElementById(
          "displayItemName"
        ).textContent;


      const code =
        document.getElementById(
          "displayCode"
        ).textContent;


      const cartonNumber =
        document.getElementById(
          "displayCartonNumber"
        ).textContent;


      const quantity =
        document.getElementById(
          "displayQuantity"
        ).textContent;



      /* ======================================
         BARCODE SVG
      ====================================== */

      const svg =
        new XMLSerializer()
          .serializeToString(
            barcode
          );


      const svgBlob =
        new Blob(
          [svg],
          {
            type:
              "image/svg+xml"
          }
        );


      const svgURL =
        URL.createObjectURL(
          svgBlob
        );


      const barcodeImage =
        new Image();



      /* ======================================
         LOAD BARCODE
      ====================================== */

      barcodeImage.onload =
        function () {


          /* ==================================
             CANVAS
          ================================== */

          const canvas =
            document.createElement(
              "canvas"
            );


          const ctx =
            canvas.getContext(
              "2d"
            );


          /*
            This is the actual label.

            1200 × 800 gives us enough
            room for the barcode and
            information.
          */

          canvas.width = 1200;

          canvas.height = 900;



          /* ==================================
             WHITE BACKGROUND
          ================================== */

          ctx.fillStyle =
            "#ffffff";


          ctx.fillRect(
            0,
            0,
            1200,
            800
          );



          /* ==================================
             BORDER
          ================================== */

          ctx.strokeStyle =
            "#000000";


          ctx.lineWidth = 5;


          ctx.strokeRect(
            20,
            20,
            1160,
            760
          );



          /* ==================================
             BARCODE
          ================================== */

          /*
            IMPORTANT:

            We do NOT stretch the barcode.

            We calculate its natural
            proportions.
          */

          const maxWidth = 1080;

          const naturalRatio =
            barcodeImage.height /
            barcodeImage.width;


          const barcodeWidth =
            Math.min(
              maxWidth,
              barcodeImage.width
            );


          const barcodeHeight =
            barcodeWidth *
            naturalRatio;


          const barcodeX =
            (
              1200 -
              barcodeWidth
            ) / 2;


          const barcodeY = 35;


          ctx.drawImage(
            barcodeImage,
            barcodeX,
            barcodeY,
            barcodeWidth,
            barcodeHeight
          );



          /* ==================================
             ITEM INFORMATION
          ================================== */

          const infoStartY =
            barcodeY +
            barcodeHeight +
            45;


          const leftX = 100;


          let y =
            infoStartY;


          const spacing = 65;



          function drawInfo(
            label,
            value
          ) {

            ctx.font =
              "bold 30px Arial";


            ctx.fillStyle =
              "#000000";


            ctx.textAlign =
              "left";


            ctx.fillText(
              label,
              leftX,
              y
            );


            ctx.font =
              "30px Arial";


            ctx.fillText(
              value,
              leftX + 230,
              y
            );


            y += spacing;

          }



          /* ==================================
             LABEL INFORMATION
          ================================== */

          drawInfo(
            "Supplier:",
            supplier
          );


          drawInfo(
            "PO #:",
            poNumber
          );


          drawInfo(
            "Item Name:",
            itemName
          );


          drawInfo(
            "Code:",
            code
          );


          drawInfo(
            "Carton #:",
            cartonNumber
          );


          drawInfo(
            "Quantity:",
            quantity
          );



          /* ==================================
             FINISH
          ================================== */

          URL.revokeObjectURL(
            svgURL
          );


          canvas.toBlob(
            function (blob) {

              resolve(blob);

            },
            "image/png"
          );

        };



      barcodeImage.onerror =
        function () {

          URL.revokeObjectURL(
            svgURL
          );


          alert(
            "There was a problem creating the label."
          );

        };



      barcodeImage.src =
        svgURL;

    }
  );

}



/* ==========================================
   DOWNLOAD LABEL
========================================== */

downloadButton.addEventListener(
  "click",
  async function () {

    const label =
      await createLabelImage();


    const barcodeNumber =
      String(nextItemId - 1)
        .padStart(6, "0");


    const url =
      URL.createObjectURL(
        label
      );


    const link =
      document.createElement(
        "a"
      );


    link.href =
      url;


    link.download =
      "barcode-label-" +
      barcodeNumber +
      ".png";


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );


    setTimeout(
      function () {

        URL.revokeObjectURL(
          url
        );

      },
      1000
    );

  }
);



/* ==========================================
   SHARE LABEL
========================================== */

shareButton.addEventListener(
  "click",
  async function () {

    const label =
      await createLabelImage();


    const barcodeNumber =
      String(nextItemId - 1)
        .padStart(6, "0");


    const file =
      new File(
        [
          label
        ],
        "barcode-label-" +
        barcodeNumber +
        ".png",
        {
          type:
            "image/png"
        }
      );


    /* ======================================
       NATIVE PHONE SHARE
    ====================================== */

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [file]
      })
    ) {

      try {

        await navigator.share({

          title:
            "Barcode Label",

          files:
            [file]

        });

      } catch (error) {

        /*
          User may simply have cancelled
          the share menu.

          We don't need to show an error.
        */

        console.log(
          "Share cancelled."
        );

      }

    }


    /* ======================================
       FALLBACK
    ====================================== */

    else {

      const url =
        URL.createObjectURL(
          label
        );


      const link =
        document.createElement(
          "a"
        );


      link.href =
        url;


      link.download =
        "barcode-label-" +
        barcodeNumber +
        ".png";


      document.body.appendChild(
        link
      );


      link.click();


      document.body.removeChild(
        link
      );


      setTimeout(
        function () {

          URL.revokeObjectURL(
            url
          );

        },
        1000
      );

    }

  }
);



/* ==========================================
   PRINT LABEL
========================================== */

printButton.addEventListener(
  "click",
  async function () {

    const label =
      await createLabelImage();


    const url =
      URL.createObjectURL(
        label
      );


    const printWindow =
      window.open(
        "",
        "_blank"
      );


    if (!printWindow) {

      alert(
        "Please allow pop-ups to print the label."
      );

      return;

    }


    printWindow.document.write(`

      <!DOCTYPE html>

      <html>

      <head>

        <title>
          Barcode Label
        </title>

        <style>

          @page {
            margin: 0;
          }

          html,
          body {

            margin: 0;

            padding: 0;

            width: 100%;

            height: 100%;

          }

          body {

            display: flex;

            justify-content: center;

            align-items: center;

          }

          img {

            display: block;

            width: 100%;

            height: auto;

          }

        </style>

      </head>


      <body>

        <img
          src="${url}"
          onload="window.print()"
        >

      </body>

      </html>

    `);


    printWindow.document.close();

  }
);



/* ==========================================
   BACK FROM CREATED ITEM
========================================== */

createdBackButton.addEventListener(
  "click",
  function () {

    itemCreatedScreen.classList.add(
      "hidden"
    );

    homeScreen.classList.remove(
      "hidden"
    );

  }
);



/* ==========================================
   DONE
========================================== */

doneButton.addEventListener(
  "click",
  function () {

    itemCreatedScreen.classList.add(
      "hidden"
    );

    homeScreen.classList.remove(
      "hidden"
    );

    itemForm.reset();

  }
);
