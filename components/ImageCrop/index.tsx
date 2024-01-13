import {
  Text,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaSave, FaUpload } from "react-icons/fa";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

interface ImageCropProps {
  id: string;
  onSelectEnd(file: Blob): void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function ImageCrop({
  id,
  isLoading,
  disabled,
  onSelectEnd,
}: ImageCropProps) {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      // setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || ""),
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 16 / 9));
  }

  function onDrawerClose() {
    setImgSrc("");
    setCompletedCrop(undefined);
    setCrop(undefined);
  }

  async function onReadyToUplaod() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/jpeg",
      quality: 0.5,
    });

    if (!blob) return;
    await onSelectEnd(blob);
    onDrawerClose();
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop, imgSrc],
  );

  return (
    <div>
      <input
        type="file"
        id={`image-upload-${id}`}
        style={{ display: "none" }}
        accept="image/*"
        onChange={onSelectFile}
      />
      <Button
        as="label"
        htmlFor={`image-upload-${id}`}
        isLoading={isLoading}
        isDisabled={disabled}
      >
        Select image to upload
      </Button>

      <Drawer
        isOpen={!!imgSrc}
        onClose={onDrawerClose}
        placement="right"
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader bg="white">
            <Text fontSize={{ base: "sm", md: "md" }} textAlign="center">
              Move/Resize frame to select what to uplaod
            </Text>
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody>
            <Center mb={3}>
              {!!completedCrop && (
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: "none",
                    objectFit: "contain",
                    width: completedCrop.width,
                    height: completedCrop.height,
                  }}
                />
              )}
            </Center>
            {!!imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={16 / 9}
                // circularCrop
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </DrawerBody>
          <DrawerFooter gap={2}>
            <Button variant="outline" onClick={onDrawerClose}>
              CANCEL
            </Button>
            <Button
              onClick={onReadyToUplaod}
              colorScheme="blue"
              rightIcon={<FaUpload />}
              isLoading={isLoading}
            >
              UPLOAD
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
