import { Heading, Section } from '@react-email/components';

/**
 * Renders a verification code component.
 *
 * @param children - The verification code to be displayed.
 * @returns The rendered verification code component.
 */
export function VerificationCode({ children }: { children: string }) {
  const group1 = children.slice(0, 3);
  const group2 = children.slice(3);

  return (
    <Section className="bg-foreground/5 border border-solid border-border rounded w-56 my-8">
      <Heading className="my-2 ml-1.5 mb-2.5 text-center tracking-[8px]">
        <span>{group1}</span>
        <span className="ml-3">{group2}</span>
      </Heading>
    </Section>
  );
}
