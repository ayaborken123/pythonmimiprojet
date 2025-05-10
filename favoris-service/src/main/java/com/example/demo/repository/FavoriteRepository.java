public interface FavoriteRepository extends MongoRepository<FavoriteItem, String> {
    List<FavoriteItem> findByUserId(String userId);
    
    @Query("{'userId': ?0, 'itemId': ?1}")
    void deleteByUserAndItem(String userId, String itemId);
}