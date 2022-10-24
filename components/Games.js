import { Flex, Table, Thead, Tr, Th, Tbody, Td, Button, useDisclosure } from '@chakra-ui/react';
import NextLink from 'next/link';
import { NewGameModal } from './NewGameModal';

export default function Games({ data }) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	console.log(data);

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
					{data?.map((game) => (
						<Tr key={game.id}>
							<Td>{game.name}</Td>
							<Td>
								<NextLink href={`/games/${game.id}`} passHref>
									<Button as="a">OPEN</Button>
								</NextLink>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>

			<Button colorScheme="red" onClick={onOpen}>
				Create New
			</Button>

			<NewGameModal isOpen={isOpen} onClose={onClose} gamesQuery={gamesQuery} />
		</Flex>
	);
}
