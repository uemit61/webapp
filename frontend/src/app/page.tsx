import Image from "next/image";

export default function Home()
{
    {/*min-h-screen = Seitenfüllend + wachsend (Layout-Grundstruktur)*/}
    {/*max-h-screen = Begrenzt + scrollbar (z. B. für Dialoge, Menüs)*/}
    {/*flex  setzt display: flex*/}
    {/*flex-col Untereinander,  flex-row Nebeneinander*/}
    {/*padding  p-*  Werte siehe Tailwind-Doukumentation*/}
    return (
<main  className="min-h-[100dvh] p-4">
        <div className={'flex p-4 flex-col flex-1'}>


             <Image
                src="/BannerComplete.jpg"
                width={1500}
                height={1000}
                className="mb-3  w-full
                h-full "
                alt="Screenshot"
            />

            <p>Homepage</p>
        </div>
 </main>

    )
}
