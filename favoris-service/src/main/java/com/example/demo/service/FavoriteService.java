@Service
@CacheConfig(cacheNames = "favorites")
public class FavoriteService {
    
    private final FavoriteRepository repository;

    // Ajout de la gestion des erreurs
    @Cacheable(key = "#userId")
    public List<FavoriteItem> getFavorites(String userId) {
        try {
            return repository.findByUserId(userId);
        } catch (Exception e) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur d'accès aux favoris"
            );
        }
    }

    // Ajout de la validation
    @CacheEvict(key = "#userId")
    public void addFavorite(FavoriteItem favorite) {
        if(favorite.getUserId() == null || favorite.getItemId() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "Données de favori invalides"
            );
        }
        repository.save(favorite);
    }
}