import { useState, useCallback } from "react";
import useSWR from "swr";
import {
  chakra,
  Button,
  VStack,
  Flex,
  Box,
  Text,
  Avatar,
  StackDivider,
  Heading,
  OrderedList,
  ListItem
} from "@chakra-ui/react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { fetcher } from "../libs/fetcher";
import Layout from "../components/Layout";

export default function GamePage() {
  const [claimer, setClaimer] = useState();
  const [signature, setSignature] = useLocalStorage("s", null);
  const { data: user } = useSWR(`/api/users/me?signature=${signature}`);
  const { data: match, mutate: mutateMatch } = useSWR(
    `/api/match?signature=${signature}`
  );
  const { data: players } = useSWR(`/api/players`, {
    refreshInterval: 5000
  });

  const onClaim = (player) => async () => {
    setClaimer(player);
    const signature = await fetcher(`/api/signatures`, {
      method: "POST",
      body: JSON.stringify(player)
    });
    setSignature(signature.signature);
  };

  const onPlay = useCallback(async () => {
    const match = await fetcher(`/api/match?signature=${signature}`, {
      method: "POST"
    });
    mutateMatch(match);
  }, [mutateMatch, signature]);

  const onReset = useCallback(async () => {
    await fetcher(`/api/reset?signature=${signature}`, {
      method: "POST"
    });
    mutateMatch(undefined);
  }, [mutateMatch, signature]);

  const sortedPlayers = user
    ? players?.reduce((acc, element) => {
        if (user.id === element.id) {
          return [element, ...acc];
        }
        return [...acc, element];
      }, [])
    : players;

  return (
    <Layout>
      <VStack spacing={8} bg="white" p={5} borderRadius="md" boxShadow="2xl">
        <Heading>🎅 Secret Santa! 🍺</Heading>
        <OrderedList
          mr="5"
          maxWidth="300px"
          fontSize="xs"
          color="gray.400"
          pl="5"
        >
          <ListItem>
            Click on the "Claim this user!" button next to your name
          </ListItem>
          <ListItem>
            Wait for red xmas present icon to appear next to your secret santa
            person
          </ListItem>
          <ListItem>Gift price limit: 80HRK</ListItem>
        </OrderedList>
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          align="stretch"
          w="100%"
        >
          {sortedPlayers?.map((player, index) => (
            <Flex key={player.id} alignItems="center">
              <Avatar width="34px" height="34px" />
              <Text
                fontSize="lg"
                fontWeight="bold"
                minW="100px"
                ml="2"
                flex="1"
              >
                {player.name}
              </Text>
              <Box>
                {user || player.isClaimed ? (
                  <chakra.div position="relative">
                    <chakra.div
                      borderRadius="full"
                      bg={player.isClaimed ? "green.500" : "gray.300"}
                      w="20px"
                      h="20px"
                    />
                    {match?.receiverId === player.id && (
                      <chakra.img
                        className="animate__bounceIn"
                        src="/present.png"
                        w="48px"
                        h="48px"
                        display="block"
                        objectFit="contain"
                        maxW="none"
                        position="absolute"
                        left="-18px"
                        top="-14px"
                        bg="white"
                        borderColor="yellow.400"
                        borderWidth="1px"
                        borderStyle="solid"
                        p="1"
                        borderRadius="md"
                        boxShadow="md"
                      />
                    )}
                  </chakra.div>
                ) : (
                  <Button
                    as="a"
                    size="sm"
                    colorScheme="red"
                    isLoading={claimer?.id === player.id}
                    onClick={onClaim(player)}
                  >
                    Claim this user!
                  </Button>
                )}
              </Box>
            </Flex>
          ))}
        </VStack>

        {user?.isAdmin && !match && (
          <Button as="a" size="lg" colorScheme="red" onClick={onPlay} w="100%">
            Run
          </Button>
        )}
        {user?.isAdmin && match && (
          <Button as="a" size="lg" colorScheme="red" onClick={onReset} w="100%">
            Reset
          </Button>
        )}
      </VStack>
    </Layout>
  );
}
