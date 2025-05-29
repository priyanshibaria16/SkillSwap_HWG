
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SkillCardProps {
  id: string;
  name: string;
  tutor: string;
  rating: number;
  price: string;
  image: string;
  category: string;
  dataAiHint?: string;
}

export function SkillCard({ id, name, tutor, rating, price, image, category, dataAiHint }: SkillCardProps) {
  const chatHref = `/chat/skillinquiry_${id}?skillName=${encodeURIComponent(name)}&partnerName=${encodeURIComponent(tutor)}`;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0">
        <Image
          src={image}
          alt={name}
          width={400}
          height={225}
          className="object-cover w-full h-48"
          data-ai-hint={dataAiHint || "skill course"}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2">{category}</Badge>
        <CardTitle className="text-lg font-semibold mb-1 leading-tight">{name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2">By {tutor}</CardDescription>
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
          ))}
          <span className="ml-1.5 text-xs text-muted-foreground">({rating.toFixed(1)})</span>
        </div>
        <p className="text-base font-semibold text-primary">{price}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={chatHref}>
              <MessageSquare className="mr-2 h-4 w-4" /> Chat with Tutor
            </Link>
          </Button>
          <Button size="sm" asChild className="flex-1">
            <Link href={`/skill/${id}`}> {/* Ensure this links to /skill/[id] */}
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
