using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T> GetByIdAsync(int id);
        Task<IReadOnlyList<T>> ListAllAsync();
        Task<T> GetEntityWithSpec(ISpecification<T> spec);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
        Task<int> CountAsync(ISpecification<T> spec);

        //These are not asyncw because they are only asking EF to track these changes.This is happening in memory not in the db
        //The repository is not responsible to save the changes to the db, that is left to the UOW.
        void Add(T entity);
        void Update(T entity);
        void Delete(T Entity);

    }
}