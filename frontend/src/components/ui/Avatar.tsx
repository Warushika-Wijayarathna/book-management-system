import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { initials, avataaars, personas } from '@dicebear/collection';

interface AvatarProps {
  name: string;
  email?: string;
  src?: string;
  size?: number;
  className?: string;
  style?: 'initials' | 'avataaars' | 'personas';
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  email,
  src,
  size = 44,
  className = '',
  style = 'initials'
}) => {
  const avatarSvg = useMemo(() => {
    if (src) return null;

    const seed = email || name;

    // Create avatar based on style with proper typing
    let avatar;
    switch (style) {
      case 'avataaars':
        avatar = createAvatar(avataaars, {
          seed,
          size,
        });
        break;
      case 'personas':
        avatar = createAvatar(personas, {
          seed,
          size,
        });
        break;
      default:
        avatar = createAvatar(initials, {
          seed,
          size,
          backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5cc', 'ffdfba'],
          textColor: ['1f2937'],
        });
    }

    return avatar.toString();
  }, [name, email, src, size, style]);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
        onError={(e) => {
          // Fallback to generated avatar if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.nextElementSibling?.classList.remove('hidden');
        }}
      />
    );
  }

  return (
    <div
      className={`rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: avatarSvg || '' }}
    />
  );
};
