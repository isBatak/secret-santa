import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { createQuery, useSelect } from "supabase-swr";

const profilesQuery = createQuery("profiles", {
  columns: "*",
});

export const NewGameModal = ({ isOpen, onClose, gamesQuery }) => {
  const { mutate } = useSelect(gamesQuery);
  const { data } = useSelect(profilesQuery);
  const [gameName, setGameName] = useState("");
  const [gameAmount, setGameAmount] = useState("");

  const addGame = () => {
    client
      .from("games")
      .insert({
        name: gameName,
        amount: gameAmount,
      })
      .then(() => {
        mutate();
        onClose();
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Game</ModalHeader>
        <ModalCloseButton />
        <ModalBody as="form">
          <FormControl id="name" mb="2">
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </FormControl>

          <FormControl id="amount" mb="2">
            <FormLabel>Amount to spend</FormLabel>
            <Input
              type="text"
              value={gameAmount}
              onChange={(e) => setGameAmount(e.target.value)}
            />
          </FormControl>

          <FormControl id="amount" mb="2">
            <FormLabel>Participants</FormLabel>
            {data?.data.map((profile) => (
              <Box key={profile.id}>{profile.username}</Box>
            ))}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="red" onClick={addGame}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
