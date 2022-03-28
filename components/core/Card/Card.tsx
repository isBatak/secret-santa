import { chakra, forwardRef } from '@chakra-ui/react';

export interface ICardProps {}

export const Card = forwardRef<ICardProps, 'div'>((props, ref) => {
  return <chakra.div ref={ref} bg="white" p={5} borderRadius="md" boxShadow="2xl" minW="md" {...props} />;
});
