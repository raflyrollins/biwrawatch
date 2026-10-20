import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {children}
        </svg>
    );
}

export function SunIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </Icon>
    );
}

export function MoonIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
        </Icon>
    );
}

export function MonitorIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M8 20h8M12 16v4" />
        </Icon>
    );
}

export function MenuIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M4 7h16M4 12h16M4 17h16" />
        </Icon>
    );
}

export function XIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="m6 6 12 12M18 6 6 18" />
        </Icon>
    );
}

export function SearchIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </Icon>
    );
}

export function ArrowRightIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M5 12h14M13 6l6 6-6 6" />
        </Icon>
    );
}

export function ArrowUpRightIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M7 17 17 7M8 7h9v9" />
        </Icon>
    );
}

export function ChevronLeftIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="m15 18-6-6 6-6" />
        </Icon>
    );
}

export function ChevronRightIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="m9 18 6-6-6-6" />
        </Icon>
    );
}

export function ChevronDownIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="m6 9 6 6 6-6" />
        </Icon>
    );
}

export function CopyIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
        </Icon>
    );
}

export function CheckIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="m5 12 4 4L19 6" />
        </Icon>
    );
}

export function WhatsappIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            {...props}
        >
            <path d="M12.04 2a9.84 9.84 0 0 0-8.4 14.9L2.05 22l5.25-1.55A9.83 9.83 0 0 0 12.04 22 9.96 9.96 0 0 0 22 12.03 9.96 9.96 0 0 0 12.04 2Zm0 18.03a8.1 8.1 0 0 1-4.12-1.12l-.3-.18-3.12.92.94-3.04-.2-.31a8.1 8.1 0 1 1 6.8 3.73Zm4.44-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06a6.63 6.63 0 0 1-1.95-1.2 7.3 7.3 0 0 1-1.35-1.68c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
        </svg>
    );
}

export function PackageIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
            <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
        </Icon>
    );
}

export function ShieldCheckIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3Z" />
            <path d="m9 12 2 2 4-4" />
        </Icon>
    );
}

export function TruckIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z" />
            <circle cx="7" cy="18" r="1.5" />
            <circle cx="18" cy="18" r="1.5" />
        </Icon>
    );
}

export function SparklesIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
            <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
        </Icon>
    );
}

export function PlusIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M12 5v14M5 12h14" />
        </Icon>
    );
}

export function PencilIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
            <path d="m14.5 6.5 3 3" />
        </Icon>
    );
}

export function TrashIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5" />
        </Icon>
    );
}

export function LogOutIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M10 4H5v16h5M14 8l4 4-4 4M9 12h9" />
        </Icon>
    );
}

export function DashboardIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </Icon>
    );
}

export function WatchIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="5" />
            <path d="M9 7 8 3h8l-1 4M9 17l-1 4h8l-1-4M12 9v3l2 1" />
        </Icon>
    );
}

export function TagIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M20 13 13 20l-9-9V4h7l9 9Z" />
            <circle cx="8" cy="8" r="1" />
        </Icon>
    );
}

export function BuildingIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01" />
        </Icon>
    );
}

export function ExternalLinkIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5" />
        </Icon>
    );
}

export function MapPinIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </Icon>
    );
}

export function ClockIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </Icon>
    );
}

export function CalendarIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <path d="M8 3v4M16 3v4M4 10h16" />
        </Icon>
    );
}

export function UserIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
        </Icon>
    );
}

export function FilterIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M4 6h16M7 12h10M10 18h4" />
        </Icon>
    );
}

export function AlertIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16h.01" />
        </Icon>
    );
}

export function RefreshIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M20 11a8 8 0 0 0-14.9-3M4 5v4h4M4 13a8 8 0 0 0 14.9 3M20 19v-4h-4" />
        </Icon>
    );
}
