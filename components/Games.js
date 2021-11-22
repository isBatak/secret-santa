import {
  Flex,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  useDisclosure
} from "@chakra-ui/react";
import NextLink from 'next/link';
import { createQuery, useSelect } from "supabase-swr";
import { NewGameModal } from "./NewGameModal";

const gamesQuery = createQuery("games", {
  columns: "*",
});

export default function Games() {
  const { data } = useSelect(gamesQuery);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!data) {
    return null;
  }

  return (
    <Flex
      spacing={8}
      bg="white"
      p={5}
      borderRadius="md"
      boxShadow="2xl"
      align="stretch"
      direction="column"
      minW="400px"
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.data.map((game) => (
            <Tr key={game.id}>
              <Td>{game.name}</Td>
              <Td><NextLink href={`/games/${game.id}`} passHref><Button as="a">OPEN</Button></NextLink></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Button colorScheme="red" onClick={onOpen}>Create New</Button>

      <NewGameModal isOpen={isOpen} onClose={onClose} gamesQuery={gamesQuery} />
    </Flex>
  );
}
