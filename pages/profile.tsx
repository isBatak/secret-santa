import { Card } from '@/components/core/Card/Card';
import Layout from '@/components/Layout';
import {
	Avatar,
	AvatarBadge,
	Button,
	Center,
	Code,
	FormControl,
	FormLabel,
	Heading,
	IconButton,
	Input,
	Stack,
} from '@chakra-ui/react';
import { supabaseServerClient, withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { NextPage } from 'next';
import { definitions } from '../types/database';

interface ProfilePageProps {
	user: any;
	profile: definitions['profiles'];
}

const ProfilePage: NextPage<ProfilePageProps> = ({ user, profile }) => {
	console.log(profile);
	return (
		<Layout>
			<Stack as={Card} spacing={4} p={6} my={12} layerStyle="glass">
				<Heading lineHeight={1.1} color="white" fontSize={{ base: '2xl', sm: '3xl' }}>
					User Profile Edit
				</Heading>
				<FormControl id="userName">
					<FormLabel>User Avatar</FormLabel>
					<Stack direction={['column', 'row']} spacing={6}>
						<Center>
							<Avatar size="xl" src="https://bit.ly/sage-adebayo">
								<AvatarBadge
									as={IconButton}
									size="sm"
									rounded="full"
									top="-10px"
									colorScheme="red"
									aria-label="remove Image"
									icon={<SmallCloseIcon />}
								/>
							</Avatar>
						</Center>
						<Center w="full">
							<Button w="full">Change Avatar</Button>
						</Center>
					</Stack>
				</FormControl>
				<FormControl id="userName">
					<FormLabel>User name</FormLabel>
					<Input placeholder="UserName" type="text" defaultValue={profile.username} />
				</FormControl>
				<FormControl id="email">
					<FormLabel>Email address</FormLabel>
					<Input placeholder="your-email@example.com" type="email" defaultValue={user.email} />
				</FormControl>
			</Stack>
		</Layout>
	);
};

export const getServerSideProps = withAuthRequired({
	redirectTo: '/login',
	async getServerSideProps(ctx) {
		const supabase = supabaseServerClient(ctx);

		const { data: user } = await supabase.auth.api.getUserByCookie(ctx.req, ctx.res);

		const { data: profile } = await supabase
			.from<definitions['profiles']>('profiles')
			.select(`*`)
			.eq('id', user.id)
			.single();

		return { props: { profile } };
	},
});

export default ProfilePage;
