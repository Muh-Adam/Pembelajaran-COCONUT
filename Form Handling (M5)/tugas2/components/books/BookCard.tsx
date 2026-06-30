import Badge from "@/components/ui/Badge";
import { Book, BookGenre } from "@/types";

// Genre → badge color mapping
export const genreBadgeColor: Record<
  BookGenre,
  "blue" | "green" | "red" | "yellow" | "purple" | "cyan" | "slate" | "orange"
> = {
  Fiksi: "purple",
  "Non-Fiksi": "cyan",
  Sains: "green",
  Teknologi: "blue",
  Sejarah: "orange",
  Biografi: "yellow",
  Filsafat: "red",
  Psikologi: "cyan",
  Ekonomi: "green",
  Lainnya: "slate",
};

interface BookDetailProps {
  book: Book;
  showDescription?: boolean;
}

// BookDetail — receives props, demonstrates props drilling
export function BookDetail({ book, showDescription = true }: BookDetailProps) {
  const availRatio = book.stock > 0 ? book.available / book.stock : 0;
  const isLow = availRatio < 0.3 && book.available > 0;
  const isOut = book.available === 0;

  return (
    <div className="space-y-3">
      {/* ISBN */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500">ISBN:</span>
        <code className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
          {book.isbn || "—"}
        </code>
      </div>

      {/* Stock */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-slate-500 text-xs">Ketersediaan</span>
          <span
            className={`text-xs font-semibold ${
              isOut ? "text-red-400" : isLow ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {book.available} / {book.stock} tersedia
          </span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOut ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-emerald-500"
            }`}
            style={{ width: `${availRatio * 100}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={genreBadgeColor[book.genre]}>{book.genre}</Badge>
        <Badge variant="slate">{book.year}</Badge>
        {isOut && <Badge variant="red" dot>Habis</Badge>}
        {isLow && !isOut && <Badge variant="yellow" dot>Stok Menipis</Badge>}
      </div>

      {showDescription && book.description && (
        <p className="text-slate-400 text-sm leading-relaxed">{book.description}</p>
      )}

      <p className="text-slate-600 text-xs">
        Ditambahkan: {new Date(book.createdAt).toLocaleDateString("id-ID")}
      </p>
    </div>
  );
}

// ---- BookCard ---- (receives book + action handlers via props = props drilling demo)
interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onViewDetail: (book: Book) => void;
}

export default function BookCard({ book, onEdit, onDelete, onViewDetail }: BookCardProps) {
  const isOut = book.available === 0;

  return (
    <div
      className="group bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 flex flex-col"
    >
      {/* Cover */}
      <div
        className="h-32 flex items-end p-4 relative overflow-hidden flex-shrink-0"
        style={{ backgroundColor: book.coverColor + "22" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at top right, ${book.coverColor}, transparent 60%)`,
          }}
        />
        <div
          className="w-16 h-20 rounded-lg shadow-2xl flex items-center justify-center text-2xl relative z-10 flex-shrink-0"
          style={{ backgroundColor: book.coverColor + "55", border: `1px solid ${book.coverColor}44` }}
        >
          📖
        </div>
        <div className="ml-3 relative z-10 min-w-0">
          <p className="text-white font-bold text-sm leading-tight line-clamp-2">{book.title}</p>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{book.author}</p>
        </div>

        {isOut && (
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
            Habis
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Pass down to BookDetail — props drilling */}
        <BookDetail book={book} showDescription={false} />

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-slate-700/50">
          <button
            onClick={() => onViewDetail(book)}
            className="flex-1 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Detail
          </button>
          <button
            onClick={() => onEdit(book)}
            className="flex-1 py-1.5 text-xs text-blue-400 hover:text-white hover:bg-blue-600/30 rounded-lg transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(book)}
            className="flex-1 py-1.5 text-xs text-red-400 hover:text-white hover:bg-red-600/30 rounded-lg transition-colors cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
