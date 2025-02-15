import {
  Flex,
  GridItem,
  GridItemProps,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { Logo } from "@dealbase/core";
import { CloudinaryImage } from "src/components/CloudinaryImage";

interface Props {
  image: Logo;
  index?: number;
}

export const ImageCard = ({
  image,
  index,
  ...gridItemProps
}: Props & GridItemProps) => {
  const [isLessThan768] = useMediaQuery("(max-width: 768px)");

  return (
    <GridItem
      display="flex"
      flexDir="column"
      alignItems="center"
      position="relative"
      {...gridItemProps}
    >
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        _hover={{
          opacity: 0.7,
        }}
        _mediaReduceMotion={{
          transition: "none",
        }}
        transition="all 500ms ease-in-out"
        opacity={0}
        border="1px solid"
        borderColor="black"
        bg="gray.700"
        top={0}
        bottom={0}
        right={0}
        left={0}
      >
        <Text color="white">{`id: ${image.id}`}</Text>
        <Text color="white">{`Format: ${image.format}`}</Text>
        <Text color="white">{`Original Filename: ${image.originalFilename}`}</Text>
      </Flex>
      <CloudinaryImage
        publicId={image.url}
        display="flex"
        alignItems="center"
        justifyContent="center"
        imageWidth={isLessThan768 ? 192 : 192}
        minW={isLessThan768 ? "full" : "200px"}
        minH={isLessThan768 ? "200px" : "200px"}
        bg="white"
        p={0}
        alt={`${image.originalFilename} Logo`}
        border="1px solid"
        borderColor="gray.500"
        _dark={{
          borderColor: "gray.300",
        }}
      />
      {index && !isNaN(index) && (
        <Text>{`${index + 1}. ${image.originalFilename}`}</Text>
      )}
    </GridItem>
  );
};
