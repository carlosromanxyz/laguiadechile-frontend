import * as MaterialIcons from "react-icons/md";
import * as FontAwesome from "react-icons/fa";
import * as FontAwesome6 from "react-icons/fa6";
import { IconType } from "react-icons";

/**
 * Get a React Icon component dynamically by name
 * Supports Material Design (Md), Font Awesome (Fa), and Font Awesome 6 (Fa6) icons
 *
 * @param iconName - The name of the icon (e.g., "MdHome", "FaUser", "Fa6Star")
 * @returns The icon component or null if not found
 *
 * @example
 * const Icon = getIcon("MdRestaurant");
 * return Icon ? <Icon className="h-4 w-4" /> : null;
 */
export function getIcon(iconName: string): IconType | null {
  // Try Material Icons first (Md prefix)
  if (iconName.startsWith("Md")) {
    return (MaterialIcons as Record<string, IconType>)[iconName] || null;
  }

  // Try Font Awesome 6 (Fa6 prefix)
  if (iconName.startsWith("Fa6")) {
    return (FontAwesome6 as Record<string, IconType>)[iconName] || null;
  }

  // Try Font Awesome (Fa prefix)
  if (iconName.startsWith("Fa")) {
    return (FontAwesome as Record<string, IconType>)[iconName] || null;
  }

  return null;
}
