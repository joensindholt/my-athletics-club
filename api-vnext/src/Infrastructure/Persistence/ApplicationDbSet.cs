using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace MyAthleticsClub.Api.Infrastructure.Persistence
{
    public class ApplicationDbSet<T> : DbSet<T>, IQueryable<T> where T : class
    {
        private List<T> _cache;

        public ApplicationDbSet(IEnumerable<T> entities)
        {
            _cache = entities.ToList();
        }

        public IEnumerator<T> GetEnumerator() => _cache.GetEnumerator();

        public Type ElementType => _cache.AsQueryable().ElementType;

        public Expression Expression => _cache.AsQueryable().Expression;

        public IQueryProvider Provider => _cache.AsQueryable().Provider;

        public override LocalView<T> Local => base.Local;

        public override EntityEntry<T> Add(T entity)
        {
            _cache.Add(entity);
            return base.Add(entity);
        }

        public override ValueTask<EntityEntry<T>> AddAsync(T entity, CancellationToken cancellationToken = default)
        {
            _cache.Add(entity);
            return base.AddAsync(entity, cancellationToken);
        }

        public override void AddRange(params T[] entities)
        {
            _cache.AddRange(entities);
            base.AddRange(entities);
        }

        public override void AddRange(IEnumerable<T> entities)
        {
            _cache.AddRange(entities);
            base.AddRange(entities);
        }

        public override Task AddRangeAsync(params T[] entities)
        {
            _cache.AddRange(entities);
            return base.AddRangeAsync(entities);
        }

        public override Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
        {
            _cache.AddRange(entities);
            return base.AddRangeAsync(entities, cancellationToken);
        }

        public override IAsyncEnumerable<T> AsAsyncEnumerable()
        {
            return _cache.AsQueryable().AsAsyncEnumerable();
        }

        public override IQueryable<T> AsQueryable()
        {
            return _cache.AsQueryable();
        }

        public override EntityEntry<T> Attach(T entity)
        {
            return base.Attach(entity);
        }

        public override void AttachRange(params T[] entities)
        {
            base.AttachRange(entities);
        }

        public override void AttachRange(IEnumerable<T> entities)
        {
            base.AttachRange(entities);
        }

        public override bool Equals(object obj)
        {
            return base.Equals(obj);
        }

        public override T Find(params object[] keyValues)
        {
            return base.Find(keyValues);
        }

        public override ValueTask<T> FindAsync(params object[] keyValues)
        {
            return base.FindAsync(keyValues);
        }

        public override ValueTask<T> FindAsync(object[] keyValues, CancellationToken cancellationToken)
        {
            return base.FindAsync(keyValues, cancellationToken);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public override EntityEntry<T> Remove(T entity)
        {
            _cache.Remove(entity);
            return base.Remove(entity);
        }

        public override void RemoveRange(params T[] entities)
        {
            entities.ToList().ForEach(entity => _cache.Remove(entity));
            base.RemoveRange(entities);
        }

        public override void RemoveRange(IEnumerable<T> entities)
        {
            entities.ToList().ForEach(entity => _cache.Remove(entity));
            base.RemoveRange(entities);
        }

        public override string ToString()
        {
            return base.ToString();
        }

        public override EntityEntry<T> Update(T entity)
        {
            if (_cache.Contains(entity))
            {
                _cache[_cache.IndexOf(entity)] = entity;
            }

            return base.Update(entity);
        }

        public override void UpdateRange(params T[] entities)
        {
            entities.ToList().ForEach(entity => Update(entity));
            base.UpdateRange(entities);
        }

        public override void UpdateRange(IEnumerable<T> entities)
        {
            entities.ToList().ForEach(entity => Update(entity));
            base.UpdateRange(entities);
        }
    }
}