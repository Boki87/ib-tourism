import {
  AspectRatio,
  Box,
  Center,
  HStack,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaLink,
  FaMapMarked,
  FaPhone,
  FaViber,
  FaWeebly,
  FaWhatsapp,
} from "react-icons/fa";
import { Service } from "../../types/Service";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";

export default function FrontPageServices({ service }: { service: Service }) {
  return (
    <Box id={service.id} mb={8}>
      {service?.title !== "" && (
        <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={3}>
          {service.title}
        </Text>
      )}

      {service.video && (
        <AspectRatio
          maxW="100%"
          ratio={16 / 9}
          borderRadius="lg"
          overflow="hidden"
          mb={4}
        >
          <iframe
            src={service.video}
            style={{ width: "100%", height: "100%" }}
            frameBorder="0"
            allowFullScreen
          />
        </AspectRatio>
      )}

      {service.images && (
        <Box mb={3}>
          <ImageSlider images={service.images} />
        </Box>
      )}
      {service?.description && (
        <Text color="gray.700" mb={5} whiteSpace="pre-wrap">
          {service.description}
        </Text>
      )}

      {service.address && (
        <>
          <Text>Address:</Text>
          <Link
            href={`https://maps.google.com/maps?q=${service.address}`}
            target="_blank"
            textDecoration="underline"
            display="flex"
            alignItems="center"
            color="blue.500"
            _hover={{ color: "blue.300" }}
            gap={1}
            mb={3}
          >
            {service.address} <FaMapMarked />
          </Link>
        </>
      )}

      <HStack>
        {service.phone && (
          <>
            <a href={`tel:${service.phone}`}>
              <Center
                w="50px"
                h="50px"
                borderRadius="md"
                bg="#176FF2"
                color="white"
              >
                <FaPhone />
              </Center>
            </a>
            {service.has_viber && (
              <a
                href={`viber://chat?number=${service.phone
                  ?.replace("+", "%2B")
                  .replaceAll(" ", "")}`}
              >
                <Center
                  w="50px"
                  h="50px"
                  borderRadius="md"
                  bg="purple.500"
                  color="white"
                >
                  <FaViber />
                </Center>
              </a>
            )}
            {service.has_whatsapp && (
              <a href={`https://wa.me/${service.phone}`}>
                <Center
                  w="50px"
                  h="50px"
                  borderRadius="md"
                  bg="green.500"
                  color="white"
                >
                  <FaWhatsapp />
                </Center>
              </a>
            )}
          </>
        )}
        {service.url && (
          <a href={service.url} target="_blank">
            <Center w="50px" h="50px" borderRadius="md" bg="gray.100">
              <FaLink />
            </Center>
          </a>
        )}
      </HStack>
    </Box>
  );
}

interface ImageSliderProps {
  images: string[];
}

function ImageSlider({ images }: ImageSliderProps) {
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      initial: 0,
      slideChanged() {
        console.log("slide changed");
      },
      created() {
        setLoaded(true);
      },
    },
    [
      // add plugins here
    ],
  );

  return (
    <div ref={sliderRef} className="keen-slider">
      {images.map((image, index) => (
        <div
          className="keen-slider__slide"
          style={{
            height: "180px",
            width: "100%",
            background: "#efefef",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
          }}
          key={image + "_" + index}
        >
          <img
            src={image}
            style={{ minWidth: "100%", minHeight: "100%", objectFit: "cover" }}
          />
        </div>
      ))}
      {images.length > 1 && loaded && instanceRef.current && (
        <>
          <div
            onClick={() => instanceRef?.current?.prev()}
            style={{
              position: "absolute",
              top: "50%",
              left: "0px",
              background: "rgba(255,255,255,.7)",
              width: "30px",
              height: "30px",
              borderRadius: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: "translateY(-50%)",
            }}
          >
            <FaChevronLeft />
          </div>
          <div
            onClick={() => instanceRef?.current?.next()}
            style={{
              position: "absolute",
              top: "50%",
              right: "0px",
              background: "rgba(255,255,255,.7)",
              width: "30px",
              height: "30px",
              borderRadius: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: "translateY(-50%)",
            }}
          >
            <FaChevronRight />
          </div>
        </>
      )}
    </div>
  );
}
