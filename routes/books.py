from fastapi import APIRouter, Depends,HTTPException
import requests
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session

from models.schemas import RecommendedBook
from models.database import get_db  # ✅ Import correct
router = APIRouter()
from fastapi import Depends  # <-- Ajoutez cette ligne
from sqlalchemy.orm import Session  # <-- Si non déjà présent

router = APIRouter()
# Scraping des livres
@router.get("/scrape-books")
async def scrape_books(db: Session = Depends(get_db)):
    try:
        url = "https://books.toscrape.com"
        response = requests.get(url)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        count = 0
        
        for book in soup.select('article.product_pod'):
            title = book.h3.a['title']
            price = float(book.select_one('p.price_color').text.replace('£', ''))
            category = book.select_one('p.instock.availability').text.strip()
            
            db.add(RecommendedBook(
                title=title,
                price=price,
                category=category,
                availability=True
            ))
            count += 1
        
        db.commit()
        return {"status": f"{count} livres ajoutés avec succès"}
    except Exception as e:
        db.rollback()
        raise HTTPException(500, detail=str(e))

@router.get("/books/summary")
async def get_book_summary(book_title: str):
    # Exemple de résumé statique
    return {
        "summary": f"Résumé générique pour {book_title}. Ce livre explore des thèmes captivants."
    }