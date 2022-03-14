using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext _context;
        private Hashtable _repositories;

        //When we initialize UnitOfWork we create a new instance of StoreContext
        //Any repositories used inside the unit of work are stored in the Hashtable
        public UnitOfWork(StoreContext context)
        {
            _context = context;
        }

        public async Task<int> Complete()
        {
           return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        //When we call this method, TEntity will become the type of the entity(EX: Product or ProductBrand)
        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            //create a new hashtable if we don't have on already
            if (_repositories == null) _repositories = new Hashtable();

            //type = the name of the entity that is stored inside the hastable
            var type = typeof(TEntity).Name;

            //check if the hashtable doesn't contains an entry for the entity with that name
            if (!_repositories.ContainsKey(type))
            {
                //create a repositoryTpe of GenericRepository
                var repositoryType = typeof(GenericRepository<>);
                //Create an instance of this repository of that type(EX: Product) and also pass in the context we get from the UOW(top of the file)
                var repositoryInstance = Activator.CreateInstance
                (repositoryType.MakeGenericType(typeof(TEntity)), _context);
                //Add this repository instance to the hasth table
                _repositories.Add(type, repositoryInstance);
            }

            //Return it
            return (IGenericRepository<TEntity>)_repositories[type];

        }
    }
}