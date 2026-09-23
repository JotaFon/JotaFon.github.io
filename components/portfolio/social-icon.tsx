type SocialIconProps = { name: 'github' | 'linkedin' | 'gmail' | 'whatsapp' };

export function SocialIcon({ name }: SocialIconProps) {

  return <span className={`social-icon social-icon-${name}`} aria-hidden="true" />;
}
