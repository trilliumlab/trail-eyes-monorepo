import { Body, Container, Heading, Hr, Section, Text } from '@react-email/components';

export function Card({ children }: React.PropsWithChildren) {
  return (
    <Body className="bg-white my-auto mx-auto font-sans">
      <Container className="border border-solid border-border rounded-lg my-10 mx-auto p-5 max-w-[400px]">
        {children}
      </Container>
    </Body>
  );
}

export function CardContent({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

export function CardHeader({ children }: { imgSrc?: string; children: React.ReactNode }) {
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

export function CardFooter({ children }: React.PropsWithChildren) {
  return (
    <>
      <Hr className="border border-solid border-border my-6 mx-0 w-full" />
      <Text className="text-muted-foreground text-xs leading-6">{children}</Text>
    </>
  );
}
