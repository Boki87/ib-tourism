import {
  HStack,
  Button,
  Text,
  useColorModeValue,
  VStack,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { use, useEffect, useMemo, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

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

interface IDateRange {
  range?: "week" | "month";
  isLoading?: boolean;
  onDateChange: ({
    dateFrom,
    dateTo,
    dateFromISO,
    dateToISO,
    formatedFrom,
    formatedTo,
  }: {
    dateFrom: number;
    dateTo: number;
    dateFromISO: string;
    dateToISO: string;
    formatedFrom: string;
    formatedTo: string;
  }) => void;
}

const week = 7 * 24 * 60 * 60 * 1000;
const month = 30 * 24 * 60 * 60 * 1000;
const ranges = {
  week,
  month,
};

export default function DateRange({
  range = "week",
  isLoading = false,
  onDateChange,
}: IDateRange) {
  const [numOfWeeksBack, setNumOfWeeksBack] = useState(0);

  const fullYear = useMemo(() => {
    const t = +new Date() - ranges[range] * numOfWeeksBack - ranges[range];
    const year = new Date(t);
    return year.getFullYear();
  }, [numOfWeeksBack]);

  const t = +new Date();
  const tFrom = +new Date(t) - ranges[range];
  const dateTo = new Date(t);
  const dateFrom = new Date(tFrom);

  const formatedFrom = `${dateFrom.getDate()}. ${
    monthsShorthand[dateFrom.getMonth()]
  }`;

  const formatedTo = `${dateTo.getDate()}. ${
    monthsShorthand[dateTo.getMonth()]
  }`;

  const [dateRange, setDateRange] = useState({
    dateFrom: tFrom,
    dateTo: t,
    dateFromISO: new Date(tFrom).toISOString(),
    dateToISO: new Date(t).toISOString(),
    formatedFrom,
    formatedTo,
  });

  function goBack() {
    setNumOfWeeksBack((old) => old + 1);
  }
  function goForward() {
    if (numOfWeeksBack > 0) {
      setNumOfWeeksBack((old) => old - 1);
    }
  }

  useEffect(() => {
    let rangeTo = ranges[range] * numOfWeeksBack;
    let rangeFrom =
      numOfWeeksBack > 0
        ? ranges[range] * numOfWeeksBack + ranges[range]
        : ranges[range];
    let t = +new Date() - rangeTo;
    let tFrom = +new Date() - rangeFrom;

    let dateTo = new Date(t);
    let dateFrom = new Date(tFrom);
    let formatedFrom = `${dateFrom.getDate()}. ${
      monthsShorthand[dateFrom.getMonth()]
    }`;
    let formatedTo = `${dateTo.getDate()}. ${
      monthsShorthand[dateTo.getMonth()]
    }`;

    setDateRange({
      dateFrom: tFrom,
      dateTo: t,
      dateFromISO: new Date(tFrom).toISOString(),
      dateToISO: new Date(t).toISOString(),
      formatedFrom,
      formatedTo,
    });
    onDateChange({
      dateFrom: tFrom,
      dateTo: t,
      dateFromISO: new Date(tFrom).toISOString(),
      dateToISO: new Date(t).toISOString(),
      formatedFrom,
      formatedTo,
    });
  }, [numOfWeeksBack]);

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const overlayColor = useColorModeValue("whiteAlpha.700", "blackAlpha.600");
  const bg = useColorModeValue("white", "gray.800");
  return (
    <HStack
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      m="10px"
      position="relative"
      bg={bg}
    >
      <Button onClick={goBack}>
        <BsChevronLeft />
      </Button>
      <VStack minW="150px">
        <HStack w="full" justifyContent="center">
          <Text>{dateRange.formatedFrom}</Text>
          <Text>-</Text>
          <Text>{dateRange.formatedTo}</Text>
        </HStack>
        {new Date().getFullYear() > fullYear ? (
          <Center h="8px">
            <Text mt="-10px" fontSize="xs">
              {fullYear}
            </Text>
          </Center>
        ) : null}
      </VStack>
      <Button disabled={numOfWeeksBack == 0} onClick={goForward}>
        <BsChevronRight />
      </Button>

      {isLoading && (
        <Center
          w="100%"
          h="full"
          position="absolute"
          top="0px"
          left="-8px"
          margin="0px"
          padding="0px"
          zIndex={2}
          bg={overlayColor}
          borderRadius="lg"
        >
          <Spinner />
        </Center>
      )}
    </HStack>
  );
}
