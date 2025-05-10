@SpringBootTest
public class FavoriteServiceTest {
    
    @MockBean
    private FavoriteRepository repository;
    
    @Autowired
    private FavoriteService service;

    @Test
    void testAddFavorite() {
        FavoriteItem item = new FavoriteItem();
        item.setUserId("user123");
        item.setItemId("course456");
        
        when(repository.save(any())).thenReturn(item);
        
        service.addFavorite(item);
        verify(repository, times(1)).save(item);
    }
}