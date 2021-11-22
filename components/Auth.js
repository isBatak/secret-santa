import { Button, Flex, Heading, Text, Input } from "@chakra-ui/react";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

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
      <Heading className="header" align="center" mb="2">
        Log in
      </Heading>

      <Text mb="5">Sign in via magic link with your email below</Text>

      <Input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        w="full"
        mb="4"
      />

      <Button
        isLoading={loading}
        onClick={(e) => {
          e.preventDefault();
          handleLogin(email);
        }}
        className="button block"
        disabled={loading}
        colorScheme="red"
        w="100%"
      >
        Send magic link
      </Button>
    </Flex>
  );
}
