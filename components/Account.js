import { Button, Flex, Input, FormControl, FormLabel } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSession } from "supabase-swr";
import { supabase } from "../utils/supabaseClient";
import AvatarField from "./AvatarField";

export default function Account() {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, avatar_url }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username,
        avatar_url,
        updated_at: new Date()
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal" // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
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
    >
      <AvatarField
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ username, avatar_url: url });
        }}
      />

      <FormControl id="email" mb="2">
        <FormLabel>Email</FormLabel>
        <Input type="text" value={session.user.email} disabled />
      </FormControl>

      <FormControl id="username" mb="4">
        <FormLabel>Name</FormLabel>
        <Input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>

      <Button
        isLoading={loading}
        className="button block primary"
        onClick={() => updateProfile({ username, avatar_url })}
        disabled={loading}
        colorScheme="red"
        mb="2"
      >
        Update
      </Button>

      <Button
        className="button block"
        onClick={() => supabase.auth.signOut()}
        colorScheme="red"
        variant="outline"
      >
        Sign Out
      </Button>
    </Flex>
  );
}
