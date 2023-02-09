import { Box, useColorModeValue, Spinner } from "@chakra-ui/react";
import Chart, { ChartItem } from "chart.js/auto";
import { useState, useRef, useEffect, createRef } from "react";

interface IVenueChart {
  isLoading?: boolean;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    };
  };
}

export default function VenueChart({ isLoading, data }: IVenueChart) {
  const canvasRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    if (!canvasRef.current) return;
    let chartInstance = new Chart(canvasRef.current, {
      title: {
        display: false,
      },
      type: "bar",
      data: data,
    });
    return () => chartInstance.destroy();
  }, [canvasRef]);

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const colorOverlay = useColorModeValue("gray.100", "gray.700");
  const headerColor = useColorModeValue("gray.300", "gray.700");
  const color = useColorModeValue("gray.600", "gray.200");
  return (
    <Box
      m="10px"
      minW="xs"
      flex={1}
      maxW="lg"
      minH="200px"
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      position="relative"
    >
      <Box
        h="30px"
        bg={headerColor}
        color={color}
        fontSize="lg"
        borderTopRadius="inherit"
        textAlign="center"
      >
        Venue Data
      </Box>
      {isLoading ? (
        <Box
          w="full"
          minH="calc(230px)"
          borderRadius="inherit"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg={colorOverlay}
        >
          <Spinner />
        </Box>
      ) : (
        <Box p="10px">
          <canvas ref={canvasRef}></canvas>
        </Box>
      )}
    </Box>
  );
}
