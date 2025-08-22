import Image from "next/image";
import Link from "next/link";
import { IoCalendarOutline, IoLocationOutline, IoMusicalNotesOutline, IoTicketOutline } from "react-icons/io5";
import { Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
  minPrice?: number; // We'll get this from ticket classes later
}

export default function EventCard({
  event,
  minPrice
}: EventCardProps) {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Extract genre from event name or description (simple approach)
  const getGenre = (name: string, description: string) => {
    const lowerName = name.toLowerCase();
    const lowerDesc = description.toLowerCase();
    
    if (lowerName.includes('rock') || lowerDesc.includes('rock')) return 'Rock';
    if (lowerName.includes('pop') || lowerDesc.includes('pop')) return 'Pop';
    if (lowerName.includes('jazz') || lowerDesc.includes('jazz')) return 'Jazz';
    if (lowerName.includes('electronic') || lowerDesc.includes('electronic')) return 'Electronic';
    if (lowerName.includes('classical') || lowerDesc.includes('classical')) return 'Classical';
    if (lowerName.includes('hip hop') || lowerDesc.includes('hip hop')) return 'Hip Hop';
    if (lowerName.includes('indie') || lowerDesc.includes('indie')) return 'Indie';
    return 'Live Music';
  };

  const genre = getGenre(event.name, event.description);
  const eventDate = formatDate(event.date);
  
  // Use real price from API or show TBA
  const displayPrice = minPrice ? `Rp${minPrice.toLocaleString()}` : '$';
    return (
        <div className="group bg-white rounded-sm shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <Image 
                    src={event.thumbnailUrl || '/Oasis.png'} 
                    alt={`${event.name} concert`} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Genre badge */}
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-800/90 text-white text-xs font-medium rounded-sm backdrop-blur-sm">
                        <IoMusicalNotesOutline className="w-3 h-3" />
                        {genre}
                    </span>
                </div>

                {/* Price badge */}
                <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-white/95 text-green-800 text-sm font-bold rounded-sm backdrop-blur-sm">
                        From {displayPrice}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-green-800 transition-colors">
                    <Link href={`/event/${event.id}`} className="hover:underline">
                        {event.name}
                    </Link>
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <IoCalendarOutline className="w-4 h-4 text-green-700" />
                        <span>{eventDate}</span>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <IoLocationOutline className="w-4 h-4 text-green-700" />
                        <span className="truncate">{event.location}</span>
                    </div>
                </div>

                {/* Action Button */}
                <Link 
                    href={`/event/${event.id}`}
                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 bg-green-800 hover:bg-green-900 text-white text-sm font-medium rounded-sm transition-colors duration-200 group/button"
                >
                    <IoTicketOutline className="w-4 h-4 group-hover/button:scale-110 transition-transform" />
                    Get Tickets
                </Link>
            </div>

            {/* Hover effect indicator */}
            <div className="h-1 bg-gradient-to-r from-green-600 to-green-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    )
}