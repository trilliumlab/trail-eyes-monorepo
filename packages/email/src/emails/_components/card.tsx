import { Body, Container, Heading, Hr, Section, Text } from '@react-email/components';


/**
 * Renders a card component with a background color, border, and rounded corners.
 *
 * @param props - The component props.
 * @returns The rendered card component.
 */
export function Card({ children }: React.PropsWithChildren) {
  return (
    <Body className="bg-background my-auto mx-auto font-sans">
      <Container className="border border-solid border-border rounded-lg my-10 mx-auto p-5 max-w-[400px]">
        {children}
      </Container>
    </Body>
  );
}

/**
 * Renders the content of a card component.
 *
 * @param children - The content to be rendered inside the card.
 * @returns The rendered card content.
 */
export function CardContent({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

/**
 * Renders the header of a card component.
 *
 * @param children - The content to be rendered inside the card header.
 * @returns The rendered card header.
 */
export function CardHeader({ children }: React.PropsWithChildren) {
  return (
    <>
      <Section className="mt-4">
        <div className="traileyes-image my-0 mx-auto rounded-[12px]" />
      </Section>
      <Heading className="text-black text-2xl font-normal text-center p-0 my-6 mx-0">
        {children}
      </Heading>
    </>
  );
}

/**
 * Renders the footer of a card component.
 *
 * @param children - The content to be rendered inside the card footer.
 * @returns The rendered card footer.
 */
export function CardFooter({ children }: React.PropsWithChildren) {
  return (
    <>
      <Hr className="border border-solid border-border my-6 mx-0 w-full" />
      <Text className="text-muted-foreground text-xs leading-6">{children}</Text>
    </>
  );
}
