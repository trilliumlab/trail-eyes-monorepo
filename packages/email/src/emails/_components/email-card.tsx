import { Body, Container } from '@react-email/components';

export function EmailCard({ children }: React.PropsWithChildren) {
  return (
    <Body className="bg-white my-auto mx-auto font-sans">
      <Container className="border border-solid border-border rounded-lg my-10 mx-auto p-5 max-w-[400px]">
        {children}
      </Container>
    </Body>
  );
}
