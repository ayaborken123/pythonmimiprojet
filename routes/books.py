from fastapi import APIRouter, Depends, HTTPException
import requests
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session

from models.schemas import RecommendedBook
from models.database import get_db

router = APIRouter()

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

            # Texte de disponibilité : 'In stock' ou autre
            availability_text = book.select_one('p.instock.availability').text.strip()
            availability = "In stock" in availability_text

            # La catégorie n'est pas sur cette page — on met une valeur par défaut
            category = "Inconnu"

            db.add(RecommendedBook(
                title=title,
                price=price,
                category=category,
                availability=availability
            ))

            count += 1
        
        db.commit()
        return {"status": f"{count} livres ajoutés avec succès"}
    except Exception as e:
        db.rollback()
        raise HTTPException(500, detail=str(e))

@router.get("/books/summary")
async def get_book_summary(book_title: str):
    return {
        "summary": f"Résumé générique pour {book_title}. Ce livre explore des thèmes captivants."
    }
